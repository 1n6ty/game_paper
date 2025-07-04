from django.http import HttpRequest, HttpResponse, JsonResponse
from django.db.models.manager import BaseManager
from django.conf import settings

from Games.models import Game
from Main.models import User
from Main.auth import verify_authorization

import hashlib, json
from urllib.parse import parse_qsl
from requests import request, Session, Response

# Create your views here.

request_session = Session()
request_session.trust_env = False

def get_game_links(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Method to get game's paint-links
    """
    if req.method == "GET":
        games: BaseManager[Game] = Game.objects.all()

        return JsonResponse(
            {
                "games": [
                    {"name": g.name, "client_script_url": settings.MEDIA_URL + g.client_script.name, "icon_url": settings.MEDIA_URL + g.icon.name} for g in games
                ]
            }
        )
    return HttpResponse(status=400, content="No such method")

def init_game(req: HttpRequest) -> HttpResponse | JsonResponse:
    """
     Inits the game session for user on server side
    """
    if req.method == "POST":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400, content="No Authorization in header")

        try:
            parsed_auth = dict(parse_qsl(auth_header))
        except ValueError:
            return HttpResponse(status=401, content="Corrupted initData")
        if not verify_authorization(parsed_auth):
            return HttpResponse(status=401, content="Denied, invalid hash")

        try:
            auth_user: dict = json.loads(parsed_auth["user"])
            tg_id: str = hashlib.sha256(str(auth_user["id"]).encode('utf-8')).hexdigest()
        except KeyError:
            return HttpResponse(status=400, content="No valid user data in Authorization header")

        user_object: BaseManager[User] = User.objects.filter(tg_id=tg_id)
        if not user_object.exists():
            return HttpResponse(status=401, content="No such user")
        user_object: User = user_object[0]

        data: dict = json.loads(req.body)

        game_name: str | None = data.get("game_name", None)
        if game_name == None:
            return HttpResponse(status=400, content="No game_name")

        game_object: BaseManager[Game] = Game.objects.filter(name=game_name)
        if not game_object.exists():
            return HttpResponse(status=401, content="No such Game")
        game_object: Game = game_object[0]

        response: Response = request_session.post(
            'http://games_app:8080/gameinit/',
            json={
                "game_module": settings.MEDIA_URL / game_object.server_script.name.split('.')[0],
                "game_id": game_object.pk,
                "tg_id": tg_id
            }
        )
        
        return JsonResponse(
            response.json()
        )
    return HttpResponse(status=400, content="No such method")

def finish_game(req: HttpRequest) -> HttpResponse | JsonResponse:
    """
        Finishes the game session; Checks whether the game was played correctly and compute score
    """
    if req.method == "POST":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400, content="No Authorization in header")

        try:
            parsed_auth = dict(parse_qsl(auth_header))
        except ValueError:
            return HttpResponse(status=401, content="Corrupted initData")
        if not verify_authorization(parsed_auth):
            return HttpResponse(status=401, content="Denied, invalid hash")

        try:
            auth_user: dict = json.loads(parsed_auth["user"])
            tg_id: str = hashlib.sha256(str(auth_user["id"]).encode('utf-8')).hexdigest()
        except KeyError:
            return HttpResponse(status=400, content="No valid user data in Authorization header")

        user_object: BaseManager[User] = User.objects.filter(tg_id=tg_id)
        if not user_object.exists():
            return HttpResponse(status=401, content="No such user")
        user_object: User = user_object[0]

        data: dict = json.loads(req.body)

        game_name: str | None = data.get("game_name", None)
        game_data: str | None = data.get("game_data", None)
        if game_name == None or game_data == None:
            return HttpResponse(status=400, content="No game_name or game_data")

        game_object: BaseManager[Game] = Game.objects.filter(name=game_name)
        if not game_object.exists():
            return HttpResponse(status=401, content="No such Game")
        game_object: Game = game_object[0]
        
        response: Response = request_session.post(
            'http://games_app:8080/gamefinish/',
            json={
                "game_module": settings.MEDIA_URL / game_object.server_script.name.split('.')[0],
                "game_id": game_object.pk,
                "tg_id": tg_id,
                "game_data": game_data
            }
        )
        
        return JsonResponse(
            response.json()
        )
    return HttpResponse(status=400, content="No such method")