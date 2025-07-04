from django.test import TestCase
from django.test.client import Client
from django.http import HttpResponse
from django.contrib.auth.models import User as User_admin
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

import logging, os, json, hashlib, datetime
from urllib.parse import parse_qsl
from django.conf import settings
from django.core.files import File

from DataMatrix.models import Product, Purchase
from Main.models import User

# Create your tests here.

class Test_DataMatrix_Product(TestCase):
    def setUp(self) -> None:
        User_admin.objects.create_superuser("admin", "admin@gmail.com", "admin")
        self.c: Client = Client()
        self.c.login(username="admin", password="admin")

        self.logger: logging.Logger = logging.getLogger(name="DataMatrix.tests")

        self.product_info = {
            "gtin":"04607132061181",
            "name": "Milk",
            "score_for_purchase": 100,
            "preloader_test_1_path": settings.BASE_DIR / "DataMatrix/tests/preloader_test_1",
            "preloader_test_2_path": settings.BASE_DIR / "DataMatrix/tests/preloader_test_2"
        }

        with open(self.product_info["preloader_test_1_path"], 'rb') as preloader:
            self.product: Product = Product.objects.create(
                name=self.product_info["name"],
                gtin=self.product_info["gtin"],
                preloader=File(preloader),
                score_for_purchase=self.product_info["score_for_purchase"]
            )
            self.product.save()

        super().setUp()

    def tearDown(self):
        self.product.delete()

        super().tearDown()

    def test_product_preloader_path(self) -> None:
        self.logger.info("Product preloader path verification")
        self.assertIn(self.product_info["gtin"], os.listdir(settings.MEDIA_ROOT / "public/product_preloaders"))

        with open(settings.MEDIA_ROOT / f"public/product_preloaders/{self.product_info["gtin"]}", 'r') as preloader:
            with open(self.product_info["preloader_test_1_path"], 'r') as preloader_test_1:
                self.assertEqual(preloader.read(), preloader_test_1.read())

    def test_product_preloader_path_change(self) -> None:
        self.logger.info("Product preloader admin change verification")

        with open(self.product_info["preloader_test_2_path"], 'rb') as preloader_test_2:
            response: HttpResponse = self.c.post(
                reverse('admin:DataMatrix_product_change', args=[self.product.pk]), 
                {
                    "name": self.product_info["name"],
                    "gtin": self.product_info["gtin"],
                    "score_for_purchase": self.product_info["score_for_purchase"],
                    "preloader": SimpleUploadedFile('preloader_test_2', preloader_test_2.read(), "text/plain")
                },
                follow=True
            )

        self.assertIn(self.product_info["gtin"], os.listdir(settings.MEDIA_ROOT / "public/product_preloaders"))

        with open(settings.MEDIA_ROOT / f"public/product_preloaders/{self.product_info["gtin"]}", 'r') as preloader:
            with open(self.product_info["preloader_test_2_path"], 'r') as preloader_test_2:
                self.assertEqual(preloader.read(), preloader_test_2.read())

    def test_product_getting(self) -> None:
        self.logger.info("Product getting")
        response: HttpResponse = self.c.get('/dm/products/')
        
        response_json: dict = json.loads(response.content.decode('utf-8'))
        self.assertDictEqual(
            response_json["products"][0], 
            {
                "name":"Milk",
                "gtin":"04607132061181",
                "score_for_purchase": 100
            }
        )
        
    def test_product_getting_wrong_method(self) -> None:
        self.logger.info("Product getting (Wrong method)")
        response: HttpResponse = self.c.post('/dm/products/')

        self.assertEqual(response.status_code, 400)

class Test_DataMatrix_Text_Proceeding(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client(headers={"Authorization": os.getenv("AUTH_TEST")})
        self.logger: logging.Logger = logging.getLogger(name="DataMatrix.tests")

        self.parsed_auth: dict = dict(parse_qsl(os.getenv('AUTH_TEST')))
        self.auth_user: dict = json.loads(self.parsed_auth["user"])
        self.user: User = User.objects.create(
            tg_id=hashlib.sha256(str(self.auth_user["id"]).encode('utf-8')).hexdigest(),
            score=0
        )
        self.user.save()

        with open(settings.BASE_DIR / "DataMatrix/tests/preloader_test_1", 'rb') as preloader:
            self.product: Product = Product.objects.create(
                name="test",
                gtin="04607132060610",
                preloader=File(preloader),
                score_for_purchase=100
            )

        self.test_dm_text = "\u001D01046071320606102150/HVu\u001D93BV/0"

    def tearDown(self):
        self.product.delete()

        super().tearDown()

    def test_dm_proceeding(self) -> None:
        self.logger.info("DataMatrix proceeding (with purchase creation)")
        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": self.test_dm_text
            },
            content_type="application/json"
        )
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.score, 100)
    
    def test_dm_proceeding_wrong_method(self) -> None:
        self.logger.info("DataMatrix proceeding (Wrong method)")
        response: HttpResponse = self.c.get('/dm/proceed_text/')

        self.assertEqual(response.status_code, 400)

    def test_dm_proceeding_wrong_gtin(self) -> None:
        self.logger.info("DataMatrix proceeding (Wrong gtin)")
        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": "111"
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
    
    def test_dm_proceeding_twice_buy(self) -> None:
        self.logger.info("DataMatrix proceeding twice buy")
        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": self.test_dm_text
            },
            content_type="application/json"
        )

        self.user.refresh_from_db()
        self.assertEqual(self.user.score, 100)

        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": self.test_dm_text
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 403)

    def test_dm_proceeding_twice_buy_after_time_delay(self) -> None:
        self.logger.info("DataMatrix proceeding twice buy after time delay")
        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": self.test_dm_text
            },
            content_type="application/json"
        )

        self.user.refresh_from_db()
        self.assertEqual(self.user.score, 100)

        purchase: Purchase = Purchase.objects.get(pk=1)
        purchase.date = datetime.datetime.now() - datetime.timedelta(seconds=60)
        purchase.save()

        response: HttpResponse = self.c.post(
            '/dm/proceed_text/',
            data={
                "text": self.test_dm_text
            },
            content_type="application/json"
        )
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.score, 200)