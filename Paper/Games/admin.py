from django.contrib import admin

from Games.forms import GameModelForm

from Games.models import Game

# Register your models here.

@admin.register(Game)
class Game_Admin(admin.ModelAdmin):
    form = GameModelForm