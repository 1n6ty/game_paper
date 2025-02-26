from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings

from subprocess import Popen, PIPE

game_scripts_storage = FileSystemStorage(settings.BASE_DIR / 'game_scripts/', base_url=None)

class User(models.Model):
    nick = models.CharField(
        verbose_name="Nickname",
        max_length=255,
        null=False,
        blank=False,
        unique=True
    )
    # TODO birthdate
    score = models.BigIntegerField(
        verbose_name="Score",
        null=False,
        blank=False,
        default=0
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class Company(models.Model):
    name = models.CharField(
        verbose_name="Company name",
        max_length=255,
        null=False,
        blank=False
    )
    region = models.CharField(
        verbose_name="Region",
        max_length=255,
        null=False,
        blank=False
    )
    datamatrix_code = models.CharField(
        verbose_name="DataMatrix code",
        max_length=255,
        null=False,
        blank=False
    )

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"

class Game(models.Model):
    name = models.CharField(
        verbose_name="Game name",
        max_length=255,
        null=False,
        blank=False,
        unique=True
    )
    play_script = models.FileField(
        verbose_name="Play script.py",
        null=False,
        blank=False,
        upload_to="",
        storage=game_scripts_storage
    )
    paint_script = models.FileField(
        verbose_name="JS paint-script of the game",
        null=False,
        blank=False,
        upload_to="games/",
    )
    cost = models.PositiveIntegerField(
        verbose_name="Cost to open",
        null=False,
        blank=False,
        default=0
    )
    def save(self, **kwargs):
        super(Game, self).save(**kwargs)
        # TODO /update/ on score app
    
    def delete(self, **kwargs):
        Popen(["rm", "-rf", game_scripts_storage.location + '/' + self.play_script.name, settings.MEDIA_ROOT / self.paint_script.name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
        super(Game, self).delete(**kwargs)
        # TODO /update/ on score app
    
    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"

class Product_Type(models.Model):
    name = models.CharField(
        verbose_name="Company name",
        max_length=255,
        null=False,
        blank=False
    )
    company = models.ForeignKey(
        verbose_name="Company (Product holder)", 
        to=Company, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    datamatrix_code = models.CharField(
        verbose_name="DataMatrix code",
        max_length=255,
        null=False,
        blank=False
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Product types"

class Purchase(models.Model):
    buyer = models.ForeignKey(
        verbose_name="Buyer", 
        to=User, 
        on_delete=models.DO_NOTHING, 
        null=True, 
        blank=True
    )
    date = models.DateField(
        verbose_name="Birth date", 
        null=False, 
        blank=True
    )
    product_type = models.ForeignKey(
        to=Product_Type,
        verbose_name="Product",
        on_delete=models.DO_NOTHING
    )

    class Meta:
        verbose_name = "Purchase"
        verbose_name_plural = "Purchases"

class Assets(models.Model):
    file = models.FileField(
        verbose_name="File",
        null=False,
        blank=False,
        upload_to="assets/",
    )

    class Meta:
        verbose_name = "Asset"
        verbose_name_plural = "Assets"
    
    def delete(self, **kwargs):
        Popen(["rm", "-rf", settings.MEDIA_ROOT / self.file.name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
        super(Game, self).delete(**kwargs)