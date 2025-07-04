from django.http import HttpRequest, HttpResponse, JsonResponse
from django.db.models.manager import BaseManager

from DataMatrix.models import Product, Purchase
from Main.models import User
from Main.auth import verify_authorization

import json, hashlib, datetime
from urllib.parse import parse_qsl, unquote

# Create your views here.

def get_products(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Product's info getter
    """
    if req.method == "GET":
        products: BaseManager[Product] = Product.objects.all()
        return JsonResponse({
            "products": [{"name": p.name, "gtin": p.gtin, "score_for_purchase": p.score_for_purchase} for p in products]
        })
    return HttpResponse(status=400, content="No such method")


def proceed_datamatrix_text(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Datamatrix text proceeding
    """
    if req.method == "POST":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=401, content="No Authorization in header")
        
        try:
            data: dict = json.loads(req.body)
        except json.decoder.JSONDecodeError:
            return HttpResponse(status=400, content="Content should be in json")

        dm_text: str = data.get('text', None)
        if dm_text == None:
            return HttpResponse(status=400, content="No data_matrix text")
        
        try:
            parsed_auth = dict(parse_qsl(auth_header))
        except ValueError:
            return HttpResponse(status=401, content="Denied, corrupted init_data")
        if not verify_authorization(parsed_auth):
            return HttpResponse(status=401, content="Denied, invalid hash or wrong data")

        try:
            auth_user: dict = json.loads(parsed_auth["user"])
            tg_id: str = hashlib.sha256(str(auth_user["id"]).encode('utf-8')).hexdigest()
        except KeyError:
            return HttpResponse(status=400, content="No valid user data in Authorization header")

        user_object: BaseManager[User] = User.objects.filter(tg_id=tg_id)
        if not user_object.exists():
            return HttpResponse(status=401, content="No such user")
        user_object: User = user_object[0]

        dm_text: str = unquote(dm_text).replace('\u001D', '')
        
        GTIN: str | None = dm_text[2: 16] if dm_text[:2] == '01' else None
        serial: str | None = dm_text[18: 24] if dm_text[16:18] == '21' else None
        key: str | None = dm_text[26: 30] if dm_text[24:26] == '93' else None
        
        if GTIN == None or serial == None or key == None:
            return HttpResponse(status=400, content="Wrong data_matrix format")
        
        product_object: BaseManager[Product] = Product.objects.filter(gtin=GTIN)
        if not product_object.exists():
            return HttpResponse(status=400, content="No such Product(GTIN)")
        product_object: Product = product_object[0]

        #TODO Needs access to true sign api
        purchase: BaseManager[Purchase] = Purchase.objects.filter(datamatrix_text=dm_text)
        if purchase.exists() and (datetime.datetime.now() - purchase[0].date).total_seconds() < 30:
            return HttpResponse(status=403, content="This product has been already sold")
        purchase, _ = Purchase.objects.update_or_create(datamatrix_text=dm_text, defaults={'datamatrix_text': dm_text, 'product': product_object, 'buyer': user_object, 'date': datetime.datetime.now()})

        user_object.score += int(product_object.score_for_purchase)
        user_object.save()

        return JsonResponse({
            "score_for_purchase": product_object.score_for_purchase,
            "gtin": product_object.gtin
        })

    return HttpResponse(status=400, content="No such method")