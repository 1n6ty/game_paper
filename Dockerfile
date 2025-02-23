FROM python:3

WORKDIR /app

COPY requirements_docker.txt ./
RUN mkdir ./game_scripts
RUN pip install --no-cache-dir -r requirements_docker.txt