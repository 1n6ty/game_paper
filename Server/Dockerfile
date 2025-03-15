FROM python:3-slim

WORKDIR /app

RUN mkdir games
COPY . .
RUN pip install --no-cache-dir -r requirements_server.txt
CMD [ "gunicorn", "-b",  "0.0.0.0:8080", "Paper.wsgi:application" ]