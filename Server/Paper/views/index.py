from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from django.db.models.manager import BaseManager
from django.shortcuts import render

from operator import itemgetter
import os, hmac, hashlib
from random import choice

from ..models import Product_Type, Fact_about_milk

BOT_TOKEN = os.getenv("MINIAPP_BOT_TOKEN", None)
secret_key = hmac.new(
    key=b"WebAppData", msg=BOT_TOKEN.encode(), digestmod=hashlib.sha256
).digest()

def _verify_authorization(parsed_data: dict) -> bool:
    if "hash" not in parsed_data:
        return False

    hash_ = parsed_data.pop('hash')
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items(), key=itemgetter(0))
    )
    calculated_hash = hmac.new(
        key=secret_key, msg=data_check_string.encode(), digestmod=hashlib.sha256
    ).hexdigest()
    return calculated_hash == hash_

def get_product_costs(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Product costs gettter
    """

    if req.method == "GET":
        prod_obj: BaseManager[Product_Type] = Product_Type.objects.all()
        
        return JsonResponse({
            p.name: p.score_for_purchase for p in prod_obj
        })

    return HttpResponse(400, content="No such method")

def get_GTIN(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        GTIN info getter
    """
    if req.method == "GET":
        products: BaseManager[Product_Type] = Product_Type.objects.all()
        return JsonResponse(
            [{"name": p.name, "gtin": p.gtin, "score_for_purchase": p.score_for_purchase} for p in products]
        )
    return HttpResponse(status=400)

def index(req: HttpRequest) -> HttpResponse:
    """
        Method implements the home page view
    """
    if req.method == "GET":
        return render(req, 'index.html')
    return HttpResponse(status=400)

def get_random_fact_about_milk(req: HttpRequest) -> HttpResponse:
    """
        Method to get random fact from database about milk
    """
    if req.method == "GET":
        texts = [
            "Молоко помогает охлаждаться в жару. Из-за высокой влажности и состава оно усваивается легче, чем сладкие напитки",
            "Белок в молоке — как строитель для мышц. В 1 стакане — около 8 г белка, полезного для роста и силы",
            "Первое мороженое появилось более 2000 лет назад в Китае! Это был замороженный молочный напиток с рисом",
            "Молоко содержит более 400 питательных веществ. Включая белки, жиры, минералы и 13 витаминов"
        ]
        return JsonResponse({"text": choice(texts)})
    return HttpResponse(status=400)