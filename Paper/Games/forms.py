from django import forms
from django.conf import settings

from Games.models import Game

import zipfile
from subprocess import Popen, PIPE

class GameModelForm(forms.ModelForm):
    def save(self, commit=True):
        server_script = self.cleaned_data.get('server_script', None)
        client_script = self.cleaned_data.get('client_script', None)
        
        if "icon" in self.changed_data and "icon" in self.initial:
            Popen(["rm", "-rf", settings.MEDIA_ROOT / self.initial["icon"].name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()

        if "server_script" in self.changed_data:
            if "server_script" in self.initial:
                Popen(["rm", "-rf", settings.MEDIA_ROOT / self.initial["server_script"].name.split('.')[0]], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
            with zipfile.ZipFile(server_script.file, "r") as zip_ref:
                zip_ref.extractall(settings.MEDIA_ROOT / Game.server_script_root / server_script.name.split('.')[0])

        if "client_script" in self.changed_data:
            if "client_script" in self.initial:
                Popen(["rm", "-rf", settings.MEDIA_ROOT / self.initial["client_script"].name.split('.')[0]], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
            with zipfile.ZipFile(client_script.file, "r") as zip_ref:
                zip_ref.extractall(settings.MEDIA_ROOT / Game.client_script_root / client_script.name.split('.')[0])
        
        return super().save(commit=commit)

    def clean(self):
        server_script = self.cleaned_data.get('server_script', None)
        client_script = self.cleaned_data.get('client_script', None)

        if not (("zip" in server_script.name) and ("zip" in client_script.name)):
            raise forms.ValidationError("Scripts should be posted in zip archive")

        return super().clean()

    class Meta:
        model = Game
        fields = '__all__'