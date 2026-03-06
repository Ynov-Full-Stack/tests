# Image plus simple que Alpine pour Python tout en étant raisonnable au niveau du poids
FROM python:3.14.3-slim

WORKDIR /app

COPY server/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "server.main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
