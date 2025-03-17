FROM python:3-slim

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir -r requirements_server.txt
CMD [ "bash", "-c", "python3 manage.py makemigrations && python3 manage.py makemigrations Paper && python3 manage.py migrate && python3 manage.py createsuperuser --noinput && python3 manage.py collectstatic --no-input && gunicorn -b 0.0.0.0:8080 Paper.wsgi:application" ]