from django.urls import path

from DataMatrix.views import get_products, proceed_datamatrix_text

urlpatterns = [
    path('products/', get_products, name='DataMatrix.products'), # Products getter
    path('proceed_text/', proceed_datamatrix_text, name='DataMatrix.proceed_text'), # Data matrix text proceeder
]