from django.urls import path
from . import views

urlpatterns = [
    path('api/chat/rooms/', views.get_chat_rooms, name='chat_rooms'),
    path('api/chat/rooms/create/', views.create_chat_room, name='create_chat_room'),
    path('api/chat/rooms/<int:room_id>/messages/', views.get_room_messages, name='room_messages'),
    path('api/chat/users/', views.get_available_users, name='available_users'),
] 