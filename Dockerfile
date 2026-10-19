FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MARGIN_DATA_DIR=/var/data \
    MARGIN_HOST=0.0.0.0

WORKDIR /app

COPY app ./app
COPY server.py ./
COPY README.md ./

RUN mkdir -p /var/data

EXPOSE 8765

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8765/api/health', timeout=3)"

CMD ["python", "server.py", "--host", "0.0.0.0", "--no-open"]
