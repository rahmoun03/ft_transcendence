from django.apps import AppConfig
from django.conf import settings
import os

class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Chat'
    path = os.path.join(settings.BASE_DIR, 'Chat')

    def ready(self):
        pass  # Remove the signals import since we don't have any signals yet 