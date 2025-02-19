from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer, UserProfileSerializer
from UserAccount.models import UserProfile
from django.db.models import Q
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    try:
        data = request.data
        participants = data.get('participants', [])
        is_direct = data.get('is_direct_message', False)

        if is_direct:
            # Check if a direct message room already exists
            existing_room = ChatRoom.objects.filter(
                is_direct_message=True,
                participants=request.user
            ).filter(
                participants__in=participants
            ).first()

            if existing_room:
                return Response(ChatRoomSerializer(existing_room).data)

        # Create new room
        room = ChatRoom.objects.create(
            name=data.get('name', f'Room_{uuid.uuid4().hex[:8]}'),
            is_direct_message=is_direct
        )
        room.participants.add(request.user, *participants)
        
        return Response(ChatRoomSerializer(room).data)
    except Exception as e:
        return Response({'detail': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_rooms(request):
    rooms = ChatRoom.objects.filter(participants=request.user)
    serializer = ChatRoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_room_messages(request, room_id):
    try:
        # First try to find an existing room
        room = ChatRoom.objects.filter(id=room_id, participants=request.user).first()
        
        if not room:
            # If room doesn't exist, create a new one
            room = ChatRoom.objects.create(
                name=f"room_{room_id}",
                is_direct_message=True
            )
            room.participants.add(request.user)
        
        messages = Message.objects.filter(room=room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to get messages: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_users(request):
    """Get all users except the current user"""
    users = UserProfile.objects.exclude(id=request.user.id)
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_direct_message_room(request, user_id):
    try:
        # Find existing direct message room between the two users
        room = ChatRoom.objects.filter(
            is_direct_message=True,
            participants=request.user
        ).filter(
            participants=user_id
        ).first()
        
        if room:
            return Response(ChatRoomSerializer(room).data)
        return Response({'detail': 'Room not found'}, status=404)
    except Exception as e:
        return Response({'detail': str(e)}, status=400) 