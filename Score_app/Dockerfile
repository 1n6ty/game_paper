FROM python:3-slim

WORKDIR /app

RUN mkdir games
COPY . .
RUN pip install --no-cache-dir -r requirements_score_app.txt
CMD ["python3", "-u", "-m", "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8080"]