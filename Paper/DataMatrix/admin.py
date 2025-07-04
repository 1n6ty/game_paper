from django.contrib import admin

from DataMatrix.forms import ProductModelForm
from DataMatrix.models import Product, Purchase
# Register your models here.

@admin.register(Product)
class Product_Admin(admin.ModelAdmin):
    form = ProductModelForm

@admin.register(Purchase)
class Purchase_Admin(admin.ModelAdmin):
    pass
