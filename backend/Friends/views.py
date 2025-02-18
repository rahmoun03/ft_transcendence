from django.db import models, transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import UserProfile,FriendRequest

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    sender = request.user
    receiver_username = request.data.get('receiver')

    try:
        receiver = UserProfile.objects.get(username=receiver_username)
    except UserProfile.DoesNotExist:
        raise NotFound('User not found')

    # Prevent self-requests and duplicate requests
    if sender == receiver:
        return Response(
            {'detail': "You cannot send a friend request to yourself."}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check for existing requests
    existing_request = FriendRequest.objects.filter(
        sender=sender, 
        receiver=receiver, 
        status='PENDING'
    ).exists()

    if existing_request:
        return Response(
            {'detail': 'Friend request already sent.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create friend request
    with transaction.atomic():
        friend_request = FriendRequest.objects.create(
            sender=sender, 
            receiver=receiver, 
            status='PENDING'
        )

    return Response(
        {'detail': 'Friend request sent successfully!', 'request_id': friend_request.id}, 
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_friend_request(request, request_id):
    """Handle incoming friend request - accept or reject."""
    action = request.data.get('action', '').upper()
    
    try:
        friend_request = FriendRequest.objects.get(
            id=request_id, 
            receiver=request.user, 
            status='PENDING'
        )
    except FriendRequest.DoesNotExist:
        return Response(
            {"detail": "Friend request not found or already processed."}, 
            status=status.HTTP_404_NOT_FOUND
        )

    with transaction.atomic():
        if action == 'ACCEPT':
            # Add to friends list
            friend_request.sender.friends.add(friend_request.receiver)
            friend_request.status = 'ACCEPTED'
            friend_request.save()

            return Response(
                {"message": "Friend request accepted.", "sender": friend_request.sender.username}, 
                status=status.HTTP_200_OK
            )
        
        elif action == 'REJECT':
            friend_request.status = 'REJECTED'
            friend_request.save()

            return Response(
                {"message": "Friend request rejected."}, 
                status=status.HTTP_200_OK
            )
        
        else:
            return Response(
                {"detail": "Invalid action. Use 'ACCEPT' or 'REJECT'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friend_requests(request):
    """List pending friend requests for the current user."""
    pending_requests = FriendRequest.objects.filter(
        receiver=request.user, 
        status='PENDING'
    )
    
    request_data = [{
        'id': req.id,
        'sender': req.sender.username,
        'created_at': req.created_at
    } for req in pending_requests]

    return Response({
        'pending_requests': request_data,
        'total_requests': len(request_data)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request):
    """List all friends for the current user."""
    friends = request.user.friends.all()
    
    friend_data = [{
        'username': friend.username,
        'email': friend.email,
        'profile_pic': friend.profile_pic.url if friend.profile_pic else None
    } for friend in friends]

    return Response({
        'friends': friend_data,
        'total_friends': len(friend_data)
    })