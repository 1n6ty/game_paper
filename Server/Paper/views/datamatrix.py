from django.http.request import HttpRequest
from django.http.response import JsonResponse, HttpResponse
from django.db.models.manager import BaseManager
from ..models import User, Product_Type, Purchase
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import hashlib
from urllib.parse import parse_qsl, unquote
import json, datetime, re
from pathlib import Path

from .index import _verify_authorization

@csrf_exempt
def proceed_datamatrix_text(req: HttpRequest) -> JsonResponse | HttpResponse:
    """
        Method implements datamatrix text proceeding
    """

    if req.method == "POST":
        auth_header = req.headers.get("Authorization", None)
        if auth_header == None:
            return HttpResponse(status=400, content="No Authorization in header")
        
        data: dict = json.loads(req.body)

        dm_text: str = data.get('text', None)
        if dm_text == None:
            return HttpResponse(status=400, content="No dataMatrix text")
        
        try:
            parsed_auth = dict(parse_qsl(auth_header))
        except ValueError:
            return HttpResponse(status=401, content="Corrupted initData")
        if not _verify_authorization(parsed_auth):
            return HttpResponse(status=401, content="Denied, invalid hash")

        tg_id = hashlib.sha256(str(json.loads(parsed_auth["user"])["id"]).encode('utf-8')).hexdigest()

        dm_text = unquote(dm_text).replace('\u001D', '')
        
        GTIN = dm_text[2: 16] if dm_text[:2] == '01' else None
        serial = dm_text[18: 24] if dm_text[16:18] == '21' else None
        key = dm_text[26: 30] if dm_text[24:26] == '93' else None

        if GTIN == None or serial == None or key == None:
            return HttpResponse(status=400, content="Wrong format")

        prod_obj: BaseManager[Product_Type] = Product_Type.objects.filter(gtin = GTIN)
        usr_obj: BaseManager[User] = User.objects.filter(tg_id = tg_id)
        if not (usr_obj.exists() and prod_obj.exists()):
            return HttpResponse(status=401, content="No such Product(GTIN) or User")
        prod_obj: Product_Type = prod_obj[0]
        usr_obj: User = usr_obj[0]

        purch: BaseManager[Purchase] = Purchase.objects.filter(datamatrix_text=dm_text)
        if purch.exists() and (datetime.datetime.now() - purch[0].date).total_seconds() < 30: #TODO remove in real prod
            return HttpResponse(403, "This product was already sold")
        #TODO remove in real prod
        Purchase.objects.update_or_create(datamatrix_text=dm_text, defaults={'datamatrix_text':dm_text, 'product_type':prod_obj, 'buyer':usr_obj, 'date': datetime.datetime.now()})

        usr_obj.score += int(prod_obj.score_for_purchase)
        usr_obj.save()

        return JsonResponse({
            "score": prod_obj.score_for_purchase,
            "path": prod_obj.preloader.name if bool(prod_obj.preloader) else ""
        })

    return HttpResponse(400, content="No such method")