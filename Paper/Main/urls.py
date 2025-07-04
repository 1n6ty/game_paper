from django.urls import path

from Main.views import index, get_random_fact_about_milk, get_score

urlpatterns = [
    path('', index, name='Main.index'), # Main page
    path('fact_about_milk/', get_random_fact_about_milk, name='Main.fact_about_milk'), # Random fact about milk getter
    path('score/', get_score, name="Main.score"), # Current score getter
]