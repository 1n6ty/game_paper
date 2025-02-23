from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse

from django.db.models.manager import BaseManager
from ..models import Game, User

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

def proceed_moves(req: HttpRequest) -> None:
    pass
