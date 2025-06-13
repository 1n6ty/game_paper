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

from .views.index import index, get_product_costs, get_random_fact_about_milk
from .views.games import get_game_links, get_score, finish_game, init_game
from .views.datamatrix import proceed_datamatrix_text
from .views.admin import render_admin

urlpatterns = [
    path('admin_dj/', admin.site.urls),
    path('', index, name="index"), # home page
    path('gamelinks/', get_game_links, name="gamelinks"), # games' links getter
    path('score/', get_score, name="score_get"), # score getter
    path('gamefinish/', finish_game, name="finish_game"), # Game process handler
    path('gameinit/', init_game, name="init_game"), # Game initiator
    path('datamatrix/', proceed_datamatrix_text, name="datamatrix"), # Datamatrix proceedure
    path('products/', get_product_costs, name="product_costs"), # product costs getter
    path('admin/', render_admin, name="admin"), # admin page
    path('randomfact/', get_random_fact_about_milk, name="random_fact")
]
