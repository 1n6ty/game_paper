from django.contrib import admin
from django.http import HttpRequest

from Main.models import Setting, Fact_About_Milk, User
# Register your models here.

@admin.register(Setting)
class Settings_Admin(admin.ModelAdmin):
    def has_delete_permission(self, request: HttpRequest, obj=None) -> bool:
        return False
    
@admin.register(Fact_About_Milk)
class Fact_About_Milk_Admin(admin.ModelAdmin):
    pass

@admin.register(User)
class User_Admin(admin.ModelAdmin):
    pass