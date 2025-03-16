from django.contrib import admin
from django.conf import settings

from subprocess import Popen, PIPE

from .forms import AssetsModelForm
from .models import User, Company, Game, Product_Type, Purchase, Assets, game_scripts_storage
# Register your models here.

@admin.register(User)
class User_Admin(admin.ModelAdmin):
    pass

@admin.register(Company)
class Company_Admin(admin.ModelAdmin):
    pass

@admin.register(Game)
class Game_Admin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if change:
            if 'play_script' in form.changed_data:
                Popen(["rm", "-rf", game_scripts_storage.location + '/' + form.initial['play_script'].name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
            if 'paint_script' in form.changed_data:
                Popen(["rm", "-rf", settings.MEDIA_ROOT / form.initial['paint_script'].name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
        return super().save_model(request, obj, form, change)

@admin.register(Product_Type)
class Product_Type_Admin(admin.ModelAdmin):
    pass

@admin.register(Purchase)
class Purchase_Admin(admin.ModelAdmin):
    pass

@admin.register(Assets)
class Assets_Admin(admin.ModelAdmin):
    form = AssetsModelForm

    fieldsets = (
        (None, {
            'fields': ('root', 'zip_upload_field'),
        }),
    )