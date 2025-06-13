from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from django.db.models import Q
from django.db.models.manager import BaseManager
from django.shortcuts import render

from ..models import Product_Type, Admin_User

import hashlib, json

def login(req: HttpRequest) -> HttpResponse:
    """
        Registers session in cookies
    """
    data: dict = json.loads(req.body)

    req_email = data.get("requester_email", None)
    req_pass = data.get("requester_password", None)
    if req_email == None or req_pass == None:
        return HttpResponse(status=400, content="No requester name or password")

    user: BaseManager[Admin_User] = Admin_User.objects.filter(email=req_email, password=hashlib.sha256(str(req_pass).encode('utf-8')).hexdigest())
    if not user.exists():
        return HttpResponse(status=401, content="No such user")

def get_me(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Get me by email and password
    """
    if req.method == "GET":
        req_email = req.session.get("requester_email", None)
        req_pass = req.session.get("requester_password", None)
        if req_email == None or req_pass == None:
            return HttpResponse(status=400, content="No requester name or password, session expired")

        user: BaseManager[Admin_User] = Admin_User.objects.filter(email=req_email, password=hashlib.sha256(str(req_pass).encode('utf-8')).hexdigest())
        if not user.exists():
            return HttpResponse(status=401, content="No such user")

        return JsonResponse({"name": user.name, "email": user.email, "rights": user.rights, "duty": user.duty})
    return HttpResponse(status=400)

def get_workers(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Workers info getter
    """
    if req.method == "GET":
        req_email = req.GET.get("requester_email", None)
        if req_email == None:
            return HttpResponse(status=400, content="No requester email")

        users: BaseManager[Admin_User] = Admin_User.objects.filter(~Q(email=req_email))
        return JsonResponse(
            [{"name": u.name, "email": u.email, "rights": u.rights} for u in users] # rights (read, edit, create_users) in bits
        )
    return HttpResponse(status=400)

def get_games(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        
    """
    if req.method == "GET":
        req_name = req.GET.get("requester_name", None)
        if req_name == None:
            return HttpResponse(status=400, content="No requester name")

        users: BaseManager[Admin_User] = Admin_User.objects.filter(~Q(name=req_name))
        return JsonResponse(
            [{"name": u.name, "email": u.email, "rights": u.rights} for u in users] # rights (read, edit, create_users) in bits
        )
    return HttpResponse(status=400)

def render_admin(req: HttpRequest) -> HttpResponse:
    """
        Method implements the admin page view
    """
    if req.method == "GET":
        return render(req, 'admin.html')
    return HttpResponse(status=400)