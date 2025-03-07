from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from django.conf import settings

from django.db.models.manager import BaseManager
from ..models import Game, User

import requests
import os
import hashlib

def get_score(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Getting user's score
    """
    if req.method == "GET":
        nick: str = req.GET.get("nick", None)
        if nick == None:
            return HttpResponse(status=400)
        nick = hashlib.sha256(nick.encode('utf-8')).hexdigest()

        usr: BaseManager[User] = User.objects.filter(nick = nick)
        if not usr.exists():
            return HttpResponse(status=401)
        
        usr: User = usr[0]
        return JsonResponse(
            {
                "score": usr.score
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
                g.name: g.paint_script for g in games
            }
        )
    return HttpResponse(status=400)

def init_game(req: HttpRequest) -> None:
    """
     Inits game session for user on server side
    """
    if req.method == "POST":
        nick: str | None = req.POST.get("nick", None)
        game_name: str | None = req.POST.get("game_name", None)
        if nick == None or game_name == None:
            return HttpResponse(status=400)
        nick = hashlib.sha256(nick.encode('utf-8')).hexdigest()

        usr_obj: BaseManager[User] = User.objects.filter(nick=nick)
        game_obj: BaseManager[Game] = Game.objects.filter(pk=game_name)
        if not (usr_obj.exists() and game_obj.exists()):
            return HttpResponse(status=401)
        usr_obj: User = usr_obj[0]
        game_obj: Game = game_obj[0]

        if usr_obj.score - game_obj.cost < 0:
            return HttpResponse(status=401)
        
        usr_obj.score -= game_obj.cost
        usr_obj.save()

        settings.REDIS.set(f'{nick}:game', game_obj.play_script)

        response: requests.Response = requests.post(
            'score_app:8080/init/',
            data=dict(req.POST)
        )

        return JsonResponse(
            response.json()
        )
    return HttpResponse(status=400)

def proceed_moves(req: HttpRequest) -> HttpResponse | JsonResponse:
    """
        Proceed gamming moves
    """
    if req.method == 'POST':
        nick: str | None = req.POST.get("nick", None)
        if nick == None:
            return HttpResponse(status=400)
        nick = hashlib.sha256(nick.encode('utf-8')).hexdigest()

        game_file: str | None = settings.REDIS.get(f'{nick}:game')
        if game_file == None:
            return HttpResponse(status=401)

        game_obj: BaseManager[Game] = Game.objects.filter(play_script=game_file)
        usr_obj: BaseManager[User] = User.objects.filter(nick=nick)
        if not (usr_obj.exists() and game_obj.exists()):
            return HttpResponse(status=401)
        game_obj: Game = game_obj[0]

        response: requests.Response = requests.post(
            'score_app:8080/score/',
            data={**dict(req.POST), "game_name": game_obj.name}
        )

        return JsonResponse(
            response.json()
        )
    return HttpRequest(status=400)