from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from django.conf import settings

from django.db.models.manager import BaseManager
from ..models import Game, User

import requests

def get_score(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Getting user's score
    """
    if req.method == "GET":
        nick: str = req.GET.get("nick", None)
        if nick == None:
            return HttpResponse(status=400)
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
        nick: str = req.POST.get("nick", None)
        game_name: str = req.POST.get("nick", None)
        if nick == None or game_name == None:
            return HttpResponse(status=400)

        usr_obj = User.objects.filter(nick=nick)
        game_obj = Game.objects.filter(name=game_name)
        if not (usr_obj.exists() and game_obj.exists()):
            return HttpResponse(status=401)
        usr_obj = usr_obj[0]
        game_obj = game_obj[0]

        if usr_obj.score - game_obj.cost < 0:
            return HttpResponse(status=401)
        
        settings.REDIS.set(nick, game_obj.play_script)

        return HttpResponse(status=200)
    return HttpResponse(status=400)

def proceed_moves(req: HttpRequest) -> None:
    """
        Proceed gamming moves
    """
    # TODO Proceed moves