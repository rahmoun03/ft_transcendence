from rest_framework import serializers
from .models import UserProfile, FriendRequest

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'profile_pic']

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer(read_only=True)
    receiver = UserProfileSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']