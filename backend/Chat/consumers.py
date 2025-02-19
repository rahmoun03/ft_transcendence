import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from UserAccount.models import UserProfile
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
import logging
import aioredis
from django.conf import settings

logger = logging.getLogger(__name__)

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            # Get token from query string
            query_string = scope.get('query_string', b'').decode()
            token = dict(x.split('=') for x in query_string.split('&')).get('token', None)
            
            if token:
                # Validate token and get user
                user = await self.get_user_from_token(token)
                scope['user'] = user
            else:
                scope['user'] = AnonymousUser()
        except Exception as e:
            print(f"Auth error: {e}")
            scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            access_token = AccessToken(token)
            user = get_user_model().objects.get(id=access_token['user_id'])
            return user
        except Exception:
            return AnonymousUser()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            if self.scope["user"].is_anonymous:
                logger.error("Anonymous user tried to connect")
                await self.close()
                return

            # Test Redis connection
            try:
                redis = await aioredis.create_redis(f'redis://{settings.REDIS_HOST}:6379')
                await redis.ping()
                redis.close()
                await redis.wait_closed()
                logger.info("Redis connection successful")
            except Exception as e:
                logger.error(f"Redis connection failed: {str(e)}")
                await self.close()
                return

            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_name = f'chat_{self.room_id}'
            self.user = self.scope["user"]

            # Verify user is a participant in the room
            if not await self.is_room_participant():
                logger.error(f"User {self.user.username} is not a participant in room {self.room_id}")
                await self.close()
                return

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            logger.info(f"User {self.user.username} connected to room {self.room_id}")
            await self.accept()
            
        except Exception as e:
            logger.error(f"Error in connect: {str(e)}")
            await self.close()

    @database_sync_to_async
    def is_room_participant(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return room.participants.filter(id=self.user.id).exists()
        except ChatRoom.DoesNotExist:
            return False

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            logger.info(f"User {self.user.username} disconnected from room {self.room_id}")
        except Exception as e:
            logger.error(f"Error in disconnect: {str(e)}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data['message']
            user = self.scope["user"]
            
            logger.info(f"Received message from {user.username}: {message}")

            # Save message to database
            message_instance = await self.save_message(user.id, message)
            logger.info(f"Saved message to database with id: {message_instance.id}")

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': user.id,
                    'username': user.username,
                    'timestamp': message_instance.timestamp.isoformat()
                }
            )
            logger.info(f"Message sent to room group: {self.room_group_name}")
        except Exception as e:
            logger.error(f"Error in receive: {str(e)}")

    async def chat_message(self, event):
        try:
            # Send message to WebSocket
            message_data = {
                'type': 'chat_message',
                'message': event['message'],
                'user_id': event['user_id'],
                'username': event['username'],
                'timestamp': event['timestamp']
            }
            logger.info(f"Sending message to client: {message_data}")  # Debug log
            await self.send(text_data=json.dumps(message_data))
        except Exception as e:
            logger.error(f"Error in chat_message: {str(e)}")

    @database_sync_to_async
    def save_message(self, user_id, content):
        try:
            user = UserProfile.objects.get(id=user_id)
            room = ChatRoom.objects.get(id=self.room_id)
            message = Message.objects.create(
                room=room,
                sender=user,
                content=content
            )
            logger.info(f"Saved message: {message.id} from user {user.username}")  # Debug log
            return message
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")
            raise 