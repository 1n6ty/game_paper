from django.contrib import admin

from .models import User, Company, Game, Product_Type, Purchase, Assets
# Register your models here.

@admin.register(User)
class User_Admin(admin.ModelAdmin):
    pass

@admin.register(Company)
class Company_Admin(admin.ModelAdmin):
    pass

@admin.register(Game)
class Game_Admin(admin.ModelAdmin):
    pass

@admin.register(Product_Type)
class Product_Type_Admin(admin.ModelAdmin):
    pass

@admin.register(Purchase)
class Purchase_Admin(admin.ModelAdmin):
    pass

@admin.register(Assets)
class Assets_Admin(admin.ModelAdmin):
    pass
