from django.urls import path

from Games.views import get_game_links, init_game, finish_game

urlpatterns = [
    path('links/', get_game_links, name='Games.links'), # Games' info getter
    path('game_init/', init_game, name='Games.init_session'), # Games module session init
    path('game_finish/', finish_game, name='Games.finish_session'), # Games module session finish
]