from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer, UserProfileSerializer
from UserAccount.models import UserProfile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat_room(request):
    participant_ids = request.data.get('participants', [])
    name = request.data.get('name')
    is_direct = request.data.get('is_direct_message', False)

    try:
        room = ChatRoom.objects.create(
            name=name,
            is_direct_message=is_direct
        )
        room.participants.add(request.user, *participant_ids)
        
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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