FROM python:3.10-slim


WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

EXPOSE 8008
