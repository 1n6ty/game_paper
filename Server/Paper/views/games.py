from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from django.db.models.manager import BaseManager
from ..models import Game, User, Settings

from requests import Session, Response
import hashlib, hmac
import json
import os
from urllib.parse import parse_qs

request_session = Session()
request_session.trust_env = False

BOT_TOKEN = os.getenv("MINIAPP_BOT_TOKEN", None)

def _verify_authorization(parsed_data: str) -> bool:
    try:
        req_auth = '\n'.join([f"auth_date={parsed_data['auth_date'][0]}", f"query_id={parsed_data['query_id'][0]}", f"user={parsed_data['user'][0]}"])
        signature = hmac.new("WebAppData".encode('latin-1'), msg = BOT_TOKEN.encode('latin-1'), digestmod = hashlib.sha256).digest()
        return hmac.new(signature, msg = req_auth.encode('latin-1'), digestmod = hashlib.sha256).hexdigest() == parsed_data['hash'][0]
    except Exception:
        pass
    return False

def get_score(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Getting user's score
    """
    if req.method == "GET":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400)

        parsed_auth = parse_qs(auth_header)
        if not _verify_authorization(parsed_auth):
            return HttpResponse(status=401)

        tg_id = hashlib.sha256(str(json.loads(parsed_auth['user'][0])['id']).encode('utf-8')).hexdigest()
        usr: BaseManager[User] = User.objects.filter(tg_id = tg_id)
        if not usr.exists():
            return HttpResponse(status=401)
        
        settings_app: Settings = Settings.objects.get(pk = 1)

        usr: User = usr[0]
        return JsonResponse(
            {
                "score": usr.score,
                "coupons": int(usr.score) // int(settings_app.scores_for_coupon)
            }
        )
    return HttpResponse(400)

def get_game_links(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Method to get game's paint-links
    """
    if req.method == "GET":
        games: BaseManager[Game] = Game.objects.all()

        return JsonResponse(
            {
                g.name: {"draw_url": g.paint_script.name, "cover_url": g.icon.name} for g in games
            }
        )
    return HttpResponse(status=400)

@csrf_exempt
def init_game(req: HttpRequest) -> None:
    """
     Inits game session for user on server side
    """
    if req.method == "POST":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400)
        
        data: dict = json.loads(req.body)

        game_name: str | None = data.get("game_name", None)
        if game_name == None:
            return HttpResponse(status=400)

        parsed_auth = parse_qs(auth_header)
        if not _verify_authorization(parsed_auth):
            return HttpResponse(status=401)

        tg_id = hashlib.sha256(str(json.loads(parsed_auth['user'][0])['id']).encode('utf-8')).hexdigest()
        usr_obj: BaseManager[User] = User.objects.filter(tg_id = tg_id)

        game_obj: BaseManager[Game] = Game.objects.filter(name=game_name)
        if not (usr_obj.exists() and game_obj.exists()):
            return HttpResponse(status=401)
        usr_obj: User = usr_obj[0]
        game_obj: Game = game_obj[0]

        if usr_obj.score - game_obj.cost < 0:
            return HttpResponse(status=401)
        
        usr_obj.score -= game_obj.cost
        usr_obj.save()

        settings.REDIS.set(f'{tg_id}:game', game_obj.play_script.name)

        data["tg_id"] = tg_id
        response: Response = request_session.post(
            'http://score_app:8080/gameinit/',
            json=data
        )
        
        return JsonResponse(
            response.json()
        )
    return HttpResponse(status=400)

@csrf_exempt
def finish_game(req: HttpRequest) -> HttpResponse | JsonResponse:
    """
        Checks whether the game was played correctly and compute score
    """
    if req.method == 'POST':
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400)
        
        data: dict = json.loads(req.body)

        parsed_auth = parse_qs(auth_header)
        if not _verify_authorization(parsed_auth):
            return HttpResponse(status=401)

        tg_id = hashlib.sha256(str(json.loads(parsed_auth['user'][0])['id']).encode('utf-8')).hexdigest()

        game_file: str | None = settings.REDIS.get(f'{tg_id}:game')
        if game_file == None:
            return HttpResponse(status=401)

        game_obj: BaseManager[Game] = Game.objects.filter(play_script__contains=game_file)
        usr_obj: BaseManager[User] = User.objects.filter(tg_id = tg_id)
        if not (usr_obj.exists() and game_obj.exists()):
            return HttpResponse(status=401)
        game_obj: Game = game_obj[0]
        usr_obj: User = usr_obj[0]

        data["tg_id"] = tg_id
        response: Response = request_session.post(
            'http://score_app:8080/gamefinish/',
            json={**data, "game_name": game_obj.name}
        )

        response_json = response.json()

        if "score" in response_json:
            usr_obj.score += response_json["score"]
            usr_obj.save()

        return JsonResponse(
            response_json
        )
    return HttpRequest(status=400)