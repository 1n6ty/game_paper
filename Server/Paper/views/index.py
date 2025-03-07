from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import render

def index(req: HttpRequest) -> HttpResponse:
    """
        Method implements the home page view
    """
    if req.method == "GET":
        return render(req, 'index.html')
    return HttpResponse(status=400)