from rest_framework import serializers
from .models import UserProfile

# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = ['games_played', 'victories', 'win_rate', 'avg', 'score']
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user_profile = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user_profile

        
    
    """
        {
            "username": "example_user",
            "email": "user@example.com",
            "password": "example_password",
            "password_confirm": "example_password"
        }
    """