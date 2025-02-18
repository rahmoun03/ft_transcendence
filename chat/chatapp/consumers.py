# chatapp/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        user_id = text_data_json['user_id']
        room_name = text_data_json['room']

        # Import models here (deferred import)
        from .models import Message, ChatRoom
        from django.contrib.auth.models import User

        # Save message to database
        user = await self.get_user(user_id)
        room = await self.get_room(room_name)
        await self.save_message(user, room, message_content)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_content,
                'user': user.username,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user = event['user']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user,
        }))

    @staticmethod
    async def get_user(user_id):
        from django.contrib.auth.models import User
        return await User.objects.aget(id=user_id)

    @staticmethod
    async def get_room(room_name):
        from .models import ChatRoom
        return await ChatRoom.objects.aget(name=room_name)

    @staticmethod
    async def save_message(user, room, content):
        from .models import Message
        return await Message.objects.acreate(user=user, room=room, content=content)