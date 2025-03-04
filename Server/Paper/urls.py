"""
URL configuration for Paper project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from .views.index import index
from .views.games import get_game_links, get_score, proceed_moves, init_game

# For debug purpose
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name="index"), # home page
    path('gamelinks/', get_game_links, name="gamelinks"), # games' links getter
    path('score/', get_score, name="score_get"), # score getter
    path('move/', proceed_moves, name="proceed_moves"), # Game process handler
    path('gameinit/', init_game, name="init_game"), # Game initiator
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # TODO Remove debug
