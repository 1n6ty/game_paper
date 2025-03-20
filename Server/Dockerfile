FROM python:3-slim

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir -r requirements_server.txt
CMD [ "bash", "-c", "./start.sh" ]