FROM python:3-slim

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir -r requirements_bot.txt
CMD ["python3", "-u", "bot.py"]