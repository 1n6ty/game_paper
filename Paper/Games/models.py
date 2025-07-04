from django.db import models
from django.conf import settings
from django.dispatch import receiver

from subprocess import Popen, PIPE

# Create your models here.

class Game(models.Model):
    server_script_root = 'private/games/'
    client_script_root = 'public/games/'

    name = models.CharField(
        verbose_name="Game name",
        max_length=128,
        null=False,
        blank=False,
        unique=True
    )
    server_script = models.FileField(
        verbose_name="Python server scripts",
        null=False,
        blank=False,
        upload_to=server_script_root
    )
    client_script = models.FileField(
        verbose_name="JS client scripts",
        null=False,
        blank=False,
        upload_to=client_script_root
    )
    icon = models.FileField(
        verbose_name="Game icon",
        null=False,
        blank=False,
        upload_to="public/game_icons/",
    )
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"

@receiver(models.signals.post_delete, sender=Game)
def post_delete_signal_Game(sender, instance, using, **kwargs):
    Popen(
        [
            "rm",
            "-rf",
            settings.MEDIA_ROOT / instance.server_script.name.split('.')[0],
            settings.MEDIA_ROOT / instance.client_script.name.split('.')[0],
            settings.MEDIA_ROOT / instance.icon.name
        ], 
        stdin=PIPE, 
        stdout=PIPE, 
        stderr=PIPE, 
        encoding='utf8'
    ).communicate()

@receiver(models.signals.post_save, sender=Game)
def post_save_signal_Game(sender, instance, using, **kwargs):
    Popen(["rm", "-rf", settings.MEDIA_ROOT / instance.server_script.name, settings.MEDIA_ROOT / instance.client_script.name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()