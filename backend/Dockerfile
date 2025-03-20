FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p data/triz

# Copy project files
COPY . .

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Give ownership to the appuser
RUN chown -R appuser:appuser /app
RUN chmod -R 755 /app/data

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=True
ENV SECRET_KEY=docker-compose-secret-key
ENV ALLOWED_HOSTS=localhost,127.0.0.1,backend
ENV DATABASE_URL=sqlite:///db.sqlite3

# Run migrations and load data
RUN python manage.py migrate
RUN python create_triz_data.py

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 