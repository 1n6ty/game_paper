from django.test import TestCase
from django.test.client import Client
from django.http import HttpResponse

import logging, os, json, hashlib
from urllib.parse import parse_qsl
from django.conf import settings

from Main.auth import verify_authorization

from Main.models import Fact_About_Milk, User, Setting

# Create your tests here.

class Test_User(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client()
        self.logger: logging.Logger = logging.getLogger(name="Main.tests")

        self.parsed_auth: dict = dict(parse_qsl(os.getenv('AUTH_TEST')))

        super().setUp()

    def test_auth(self) -> None:
        self.logger.info("Telegram authorization")
        self.assertTrue(verify_authorization(self.parsed_auth))

class Test_Main_Page(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client()
        self.logger: logging.Logger = logging.getLogger(name="Main.tests")

        super().setUp()

    def test_index_getting(self) -> None:
        self.logger.info("Getting index.html")
        main_page_response: HttpResponse = self.c.get('/')

        with open(settings.BASE_DIR / 'templates/index.html', 'r') as test_html:
            self.assertHTMLEqual(main_page_response.content.decode('utf-8'), test_html.read())
    
    def test_index_wrong_method(self) -> None:
        self.logger.info("Getting index.html (Wrong method)")
        main_page_response: HttpResponse = self.c.post('/')

        self.assertEqual(main_page_response.status_code, 400)

class Test_Fact_About_Milk(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client()
        self.logger: logging.Logger = logging.getLogger(name="Main.tests")

        self.fact_about_milk_1 = Fact_About_Milk.objects.create(
            header="Header_1",
            text="Text_1"
        )
        self.fact_about_milk_1.save()

        self.fact_about_milk_2 = Fact_About_Milk.objects.create(
            header="Header_2",
            text="Text_2"
        )
        self.fact_about_milk_2.save()

        super().setUp()

    @staticmethod
    def _is_subset(arr_1: list, arr_2: list) -> bool:
        hash_set = set(arr_1)
        for num in arr_2:
            if not (num in hash_set):
                return False
        return True

    def test_fact_getting(self) -> None:
        self.logger.info("Random fact about milk getting")
        response: HttpResponse = self.c.get('/fact_about_milk/')

        response_json: dict = json.loads(response.content.decode('utf-8'))
        self.assertTrue(
            response_json["fact"]["header"] in [
                self.fact_about_milk_1.header, 
                self.fact_about_milk_2.header
            ]
        )
        self.assertTrue(
            response_json["fact"]["text"] in [
                self.fact_about_milk_1.text, 
                self.fact_about_milk_2.text
            ]
        )

    def test_fact_random(self) -> None:
        self.logger.info("Random fact about milk (random test)")
        
        max_it: int = 100
        response_headers: list[str] = []
        for _ in range(max_it):
            response_headers.append(
                json.loads(
                    self.c.get('/fact_about_milk/').content.decode('utf-8')
                )["fact"]["header"]
            )
            
            if Test_Fact_About_Milk._is_subset(
                    [
                        self.fact_about_milk_1.header, 
                        self.fact_about_milk_2.header
                    ],
                    response_headers
                ):
                break
        self.assertTrue(
            Test_Fact_About_Milk._is_subset(
                [
                    self.fact_about_milk_1.header, 
                    self.fact_about_milk_2.header
                ],
                response_headers
            )
        )
        
    def test_fact_getting_wrong_method(self) -> None:
        self.logger.info("Random fact about milk getting (Wrong method)")
        response: HttpResponse = self.c.post('/fact_about_milk/')

        self.assertEqual(response.status_code, 400)

class Test_Setting_Use(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client(headers={"Authorization": os.getenv("AUTH_TEST")})
        self.logger: logging.Logger = logging.getLogger(name="DataMatrix.tests")

        self.parsed_auth: dict = dict(parse_qsl(os.getenv('AUTH_TEST')))
        self.auth_user: dict = json.loads(self.parsed_auth["user"])
        self.user: User = User.objects.create(
            tg_id=hashlib.sha256(str(self.auth_user["id"]).encode('utf-8')).hexdigest(),
            score=100
        )
        self.user.save()

        self.setting = Setting.objects.create(
            start_score=100,
            score_for_coupon=20
        )
        self.setting.save()

        super().setUp()

    def test_score_getting(self) -> None:
        self.logger.info("Score getting")
        response: HttpResponse = self.c.get('/score/')
        
        json_response: dict = json.loads(response.content)
        self.assertDictEqual(
            json_response,
            {
                "score": 0,
                "coupons": 5,
                "score_for_coupon": 20
            }
        )
    
    def test_fact_getting_wrong_method(self) -> None:
        self.logger.info("Score getting (wrong method)")
        response: HttpResponse = self.c.post('/score/')

        self.assertEqual(response.status_code, 400)