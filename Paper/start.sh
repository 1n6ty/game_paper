python3 manage.py makemigrations || true
python3 manage.py migrate || true
python3 manage.py createsuperuser --noinput || true
python3 manage.py collectstatic --no-input || true
gunicorn -b 0.0.0.0:8080 Paper.wsgi:application