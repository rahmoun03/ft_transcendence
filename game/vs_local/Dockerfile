FROM python:latest

WORKDIR /app
RUN apt update -y ; apt upgrade -y ; pip install django; pip install --upgrade pip ;\
    python3 -m pip install Django

# CMD [ "tail", "-f" ]
CMD ["bash", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8002"]
