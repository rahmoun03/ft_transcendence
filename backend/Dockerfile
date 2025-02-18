# FROM python:3.9

# WORKDIR /app

# # Copy requirements first for better caching
# COPY requirements.txt .
# RUN pip install -r requirements.txt

# # Copy the rest of the backend code
# COPY . .

# # Run migrations and start server
# CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000


FROM python:3.9

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && \
    apt-get install -y postgresql-client curl libpq-dev

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN chmod 777 /app

EXPOSE 8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]