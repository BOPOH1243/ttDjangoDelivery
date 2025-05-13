FROM python:3.10-slim

# Устанавливаем системные зависимости, включая клиент psql
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY entrypoint.sh .
COPY project/ project/

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
