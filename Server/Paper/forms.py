from django import forms
from .models import Assets
from django.conf import settings

import zipfile
from subprocess import Popen, PIPE

class AssetsModelForm(forms.ModelForm):

    zip_upload_field = forms.FileField(label="Zip file of assets")

    def save(self, commit=True):
        zip_upload_field = self.cleaned_data.get('zip_upload_field', None)
        root = self.cleaned_data.get('root', None)
        
        if "root" in self.initial:
            if zip_upload_field != None:
                Popen(["rm", "-rf", settings.MEDIA_ROOT / "assets" / self.initial["root"]], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
                if ".zip" in zip_upload_field.name:
                    with zipfile.ZipFile(zip_upload_field.file, "r") as zip_ref:
                        zip_ref.extractall(settings.MEDIA_ROOT / "assets" / root)
            else:
                Popen(["mv", "-r", settings.MEDIA_ROOT / "assets" / self.initial["root"], settings.MEDIA_ROOT / "assets" / root], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()
        else:
            if ".zip" in zip_upload_field.name:
                with zipfile.ZipFile(zip_upload_field.file, "r") as zip_ref:
                    zip_ref.extractall(settings.MEDIA_ROOT / "assets" / root)
        return super(AssetsModelForm, self).save(commit=commit)

    class Meta:
        model = Assets
        fields = '__all__'