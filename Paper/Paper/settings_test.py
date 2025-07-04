from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

with open(BASE_DIR / '../.env', 'r') as f:
    for line in f:
        if line.startswith('#'):
            continue
        
        if '=' in line:
            key, value = line.strip().split('=', 1)
            os.environ[key] = value

from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DEBUG = True