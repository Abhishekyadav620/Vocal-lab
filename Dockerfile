# Multi-stage Python Dockerfile for Vocalis AI Backend
FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing .pyc files and buffer outputs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8005
ENV HOST=0.0.0.0

# Install system dependencies needed for audio & desktop packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libasound2-dev \
    portaudio19-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app/ ./app/
COPY engine/ ./engine/
COPY main.py .
COPY run_vocalis.py .
COPY pyproject.toml .

# Expose backend port
EXPOSE 8005

# Run FastAPI app with Uvicorn
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8005"]
