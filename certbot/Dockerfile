FROM python:3-slim

RUN apt -y -u update \
    && apt -y upgrade \
    && apt -y install python3-venv libaugeas0 \
    && python3 -m venv /opt/certbot/ \
    && /opt/certbot/bin/pip install --upgrade pip \
    && /opt/certbot/bin/pip install certbot \
    && ln -s /opt/certbot/bin/certbot /usr/bin/certbot

COPY ./renewall.py /opt/certbot/renewall.py

WORKDIR /opt/certbot

CMD [ "python3", "-u", "renewall.py" ]