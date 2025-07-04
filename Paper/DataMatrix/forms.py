from django import forms
from django.conf import settings

from DataMatrix.models import Product

from subprocess import Popen, PIPE

class ProductModelForm(forms.ModelForm):
    def save(self, commit=True):
        if "preloader" in self.changed_data and 'preloader' in self.initial:
            Popen(["rm", "-rf", settings.MEDIA_ROOT / self.initial["preloader"].name], stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding='utf8').communicate()

        return super().save(commit=commit)

    class Meta:
        model = Product
        fields = '__all__'