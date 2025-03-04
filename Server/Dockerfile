FROM python:3-slim

WORKDIR /app

RUN mkdir games
COPY . .
RUN pip install --no-cache-dir -r requirements_server.txt
CMD ["python3", "-u", "manage.py", "runserver", "0.0.0.0:8080"]