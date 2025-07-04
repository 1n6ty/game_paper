from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.db.models.manager import BaseManager

from Main.models import Fact_About_Milk, User, Setting
from Main.auth import verify_authorization

import json, hashlib
from urllib.parse import parse_qsl
from random import choice
# Create your views here.

def index(req: HttpRequest) -> HttpResponse:
    """
        Main page view
    """
    if req.method == "GET":
        return render(req, 'index.html')
    return HttpResponse(status=400, content="No such method")

def get_random_fact_about_milk(req: HttpRequest) -> HttpResponse:
    """
        Random fact about milk getter
    """
    if req.method == "GET":
        facts_about_milk: BaseManager[Fact_About_Milk] = Fact_About_Milk.objects.all()
        r_fact: Fact_About_Milk = choice(facts_about_milk)
        return JsonResponse({
            "fact": {"header": r_fact.header, "text": r_fact.text}
        })
    return HttpResponse(status=400, content="No such method")

def get_score(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Getting user's score
    """
    if req.method == "GET":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400, content="No Authorization in header")

        try:
            parsed_auth = dict(parse_qsl(auth_header))
        except ValueError:
            return HttpResponse(status=401, content="Corrupted initData")
        if not verify_authorization(parsed_auth):
            return HttpResponse(status=401, content="Denied, invalid hash")

        try:
            auth_user: dict = json.loads(parsed_auth["user"])
            tg_id: str = hashlib.sha256(str(auth_user["id"]).encode('utf-8')).hexdigest()
        except KeyError:
            return HttpResponse(status=400, content="No valid user data in Authorization header")

        user_object: BaseManager[User] = User.objects.filter(tg_id=tg_id)
        if not user_object.exists():
            return HttpResponse(status=401, content="No such user")
        user_object: User = user_object[0]

        settings_app: Setting = Setting.objects.get(pk=1)

        return JsonResponse(
            {
                "score": int(user_object.score) % int(settings_app.score_for_coupon),
                "coupons": int(user_object.score) // int(settings_app.score_for_coupon),
                "score_for_coupon": int(settings_app.score_for_coupon)
            }
        )
    return HttpResponse(status=400, content="No such method")