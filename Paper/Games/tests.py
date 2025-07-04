from django.test import TestCase
from django.test.client import Client
from django.http import HttpResponse
from django.conf import settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from django.contrib.auth.models import User as User_admin
from Main.models import User
from Games.models import Game

import json, logging, os, hashlib
from urllib.parse import parse_qsl

# Create your tests here.

class Test_Games(TestCase):
    def setUp(self) -> None:
        self.c: Client = Client(headers={"Authorization": os.getenv("AUTH_TEST")})
        self.logger: logging.Logger = logging.getLogger(name="Games.tests")

        User_admin.objects.create_superuser("admin", "admin@gmail.com", "admin")
        self.c.login(username="admin", password="admin")

        self.parsed_auth: dict = dict(parse_qsl(os.getenv('AUTH_TEST')))
        self.auth_user: dict = json.loads(self.parsed_auth["user"])
        self.user: User = User.objects.create(
            tg_id=hashlib.sha256(str(self.auth_user["id"]).encode('utf-8')).hexdigest(),
            score=100
        )
        self.user.save()    

        super().setUp()

    def tearDown(self):
        Game.objects.all().delete()
        return super().tearDown()

    def test_game_upload(self) -> None:
        self.logger.info("Game uploading")
        with open(settings.BASE_DIR / f"Games/game_example/client.zip", "rb") as client_game:
            with open(settings.BASE_DIR / f"Games/game_example/server.zip", "rb") as server_game:
                with open(settings.BASE_DIR / f"Games/game_example/icon.png", "rb") as icon:
                    response: HttpResponse = self.c.post(
                        reverse('admin:Games_game_add'), 
                        {
                            "name": "game",
                            "icon": SimpleUploadedFile('icon.png', icon.read(), "image/png"),
                            "server_script": SimpleUploadedFile('server.zip', server_game.read(), "application/zip"),
                            "client_script": SimpleUploadedFile('client.zip', client_game.read(), "application/zip")
                        },
                        follow=True
                    )
        
        self.assertIn("server", os.listdir(settings.BASE_DIR / "media/private/games"))
        self.assertIn("client", os.listdir(settings.BASE_DIR / "media/public/games"))
        self.assertIn("icon.png", os.listdir(settings.BASE_DIR / "media/public/game_icons"))

        self.assertFalse("server.zip" in os.listdir(settings.BASE_DIR / "media/private/games"))
        self.assertFalse("client.zip" in os.listdir(settings.BASE_DIR / "media/public/games"))

        Game.objects.all().delete()

        self.assertFalse("server" in os.listdir(settings.BASE_DIR / "media/private/games"))
        self.assertFalse("client" in os.listdir(settings.BASE_DIR / "media/public/games"))
        self.assertFalse("icon.png" in os.listdir(settings.BASE_DIR / "media/public/game_icons"))

    def test_game_double_upload(self) -> None:
        self.logger.info("Game uploading (double upload)")
        with open(settings.BASE_DIR / f"Games/game_example/client.zip", "rb") as client_game:
            with open(settings.BASE_DIR / f"Games/game_example/server.zip", "rb") as server_game:
                with open(settings.BASE_DIR / f"Games/game_example/icon.png", "rb") as icon:
                    response: HttpResponse = self.c.post(
                        reverse('admin:Games_game_add'), 
                        {
                            "name": "game",
                            "icon": SimpleUploadedFile('icon.png', icon.read(), "image/png"),
                            "server_script": SimpleUploadedFile('server.zip', server_game.read(), "application/zip"),
                            "client_script": SimpleUploadedFile('client.zip', client_game.read(), "application/zip")
                        },
                        follow=True
                    )
        
        with open(settings.BASE_DIR / f"Games/game_example/client.zip", "rb") as client_game:
            with open(settings.BASE_DIR / f"Games/game_example/server.zip", "rb") as server_game:
                with open(settings.BASE_DIR / f"Games/game_example/icon.png", "rb") as icon:
                    response: HttpResponse = self.c.post(
                        reverse('admin:Games_game_add'), 
                        {
                            "name": "game",
                            "icon": SimpleUploadedFile('icon.png', icon.read(), "image/png"),
                            "server_script": SimpleUploadedFile('server.zip', server_game.read(), "application/zip"),
                            "client_script": SimpleUploadedFile('client.zip', client_game.read(), "application/zip")
                        },
                        follow=True
                    )
        
        self.assertEqual(len(Game.objects.all()), 1)

    def test_links_getter(self) -> None:
        self.logger.info("Games' info getting")
        with open(settings.BASE_DIR / f"Games/game_example/client.zip", "rb") as client_game:
            with open(settings.BASE_DIR / f"Games/game_example/server.zip", "rb") as server_game:
                with open(settings.BASE_DIR / f"Games/game_example/icon.png", "rb") as icon:
                    response: HttpResponse = self.c.post(
                        reverse('admin:Games_game_add'), 
                        {
                            "name": "game",
                            "icon": SimpleUploadedFile('icon.png', icon.read(), "image/png"),
                            "server_script": SimpleUploadedFile('server.zip', server_game.read(), "application/zip"),
                            "client_script": SimpleUploadedFile('client.zip', client_game.read(), "application/zip")
                        },
                        follow=True
                    )

        response: HttpResponse = self.c.get('/games/links/')
        
        json_response: dict = json.loads(response.content)
        self.assertDictEqual(
            json_response,
            {
                "games": [
                    {'client_script_url': '/media/public/games/client.zip', 'icon_url': '/media/public/game_icons/icon.png', 'name': 'game'}
                ]
            }
        )
    
    def test_links_getter_wrong_method(self) -> None:
        self.logger.info("Games' info getting (wrong method)")
        response: HttpResponse = self.c.post('/games/links/')

        self.assertEqual(response.status_code, 400)
