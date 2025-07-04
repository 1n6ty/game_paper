from django.db import models
from django.conf import settings
from django.dispatch import receiver

from subprocess import Popen, PIPE

from Main.models import User
# Create your models here.

class Product(models.Model):
    gtin_preloader_root = 'public/product_preloaders/'

    def _get_gtin_preloader_path(self, filename) -> str:
        return f'{self.gtin_preloader_root}{self.gtin}'

    name = models.CharField(
        verbose_name="Name",
        max_length=128,
        null=False,
        blank=False,
        default="Name example"
    )
    gtin = models.CharField(
        verbose_name="DataMatrix code",
        max_length=14,
        null=False,
        blank=False,
        default="0" * 14
    )
    preloader = models.FileField(
        verbose_name="Preloader",
        upload_to=_get_gtin_preloader_path,
        blank=False,
        null=False
    )
    score_for_purchase = models.IntegerField(
        verbose_name="Score for purchase",
        null=False,
        blank=False,
        default=0
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

@receiver(models.signals.post_delete, sender=Product)
def delete_signal_Product(sender, instance, using, **kwargs):
    Popen(["rm", "-rf", settings.MEDIA_ROOT / instance.preloader.name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()

class Purchase(models.Model):
    buyer = models.ForeignKey(
        verbose_name="Buyer", 
        to=User, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=False
    )
    date = models.DateTimeField(
        verbose_name="Purchase date", 
        null=False, 
        blank=True,
        auto_now_add=True
    )
    product = models.ForeignKey(
        to=Product,
        verbose_name="Product",
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )
    datamatrix_text = models.CharField(
        verbose_name="DataMatrix code",
        max_length=128,
        null=False,
        blank=False,
        default="0" * 30
    )

    class Meta:
        verbose_name = "Purchase"
        verbose_name_plural = "Purchases"