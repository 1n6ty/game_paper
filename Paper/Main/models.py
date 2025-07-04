from django.db import models

# Create your models here.

class Setting(models.Model):
    start_score = models.BigIntegerField(
        verbose_name="Start score",
        null=False,
        blank=False,
        default=0
    )
    score_for_coupon = models.BigIntegerField(
        verbose_name="Score for coupon",
        null=False,
        blank=False,
        default=0
    )

    class Meta:
        verbose_name = "Setting"
        verbose_name_plural = "Settings"

    def __str__(self):
        return "Main setting"

class User(models.Model):
    tg_id = models.CharField(
        max_length=512,
        verbose_name="Telegram id hash",
        null=False,
        blank=False,
        unique=True
    )
    score = models.BigIntegerField(
        verbose_name="Score",
        null=False,
        blank=False,
        default=0
    )

    def __str__(self):
        return self.tg_id[:16]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class Fact_About_Milk(models.Model):
    header = models.CharField(
        verbose_name="Header",
        max_length=128,
        null=False,
        blank=False,
        default="Header example"
    )
    text = models.TextField(
        verbose_name="Text",
        null=False,
        blank=False,
        default="Some text..."
    )

    def __str__(self):
        return self.header

    class Meta:
        verbose_name = "Fact about milk"
        verbose_name_plural = "Facts about milk"