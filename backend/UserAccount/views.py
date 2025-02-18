from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import requests



# This is tokens and urls for 42 authentication
CLIENT_ID = 'u-s4t2ud-75add9f969ba831187646224971436e5fcfe681aade95fef65a96a45effc3db6'
CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:8000/api/auth/callback/'

AUTH_URL = 'https://api.intra.42.fr/oauth/authorize'
TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
  
    ################

    # views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests

@api_view(['POST'])
def register(request):
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        user_profile = serializer.save()
        return Response({
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({
            "error": "Username and password are required."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_profile = UserProfile.objects.get(username=username)
        if user_profile.check_password(password):
            refresh = RefreshToken.for_user(user_profile)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Incorrect password"
            }, status=status.HTTP_401_UNAUTHORIZED)
    except UserProfile.DoesNotExist:
        return Response({
            "error": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def login_with_42(request):
    auth_url = f"{AUTH_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
    return Response({'auth_url': auth_url}, status=status.HTTP_200_OK)

# views.py
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

FRONTEND_URL = 'http://localhost:8080'  # Add this constant

@api_view(['GET'])
def auth_callback(request):
    code = request.GET.get('code')
    if not code:
        return redirect(f'{FRONTEND_URL}/#/')

    try:
        # Exchange code for token
        token_response = requests.post(TOKEN_URL, data={
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI,
        })
        
        token_data = token_response.json()
        
        if token_response.status_code != 200:
            return redirect(f'{FRONTEND_URL}/#/')

        # Get user info from 42 API
        user_response = requests.get(
            'https://api.intra.42.fr/v2/me',
            headers={'Authorization': f'Bearer {token_data["access_token"]}'}
        )

        if user_response.status_code != 200:
            return redirect(f'{FRONTEND_URL}/#/')

        user_data = user_response.json()

        # Create or get user
        user_profile, created = UserProfile.objects.update_or_create(
            username=user_data['login'],
            defaults={
                'email': user_data['email'],
                'is_active': True,
                'profile_pic': user_data["image"]["link"] 

            }
        )
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user_profile)

        # Redirect to frontend with tokens
        return redirect(
            f'{FRONTEND_URL}/#/auth/callback'
            f'?access={str(refresh.access_token)}'
            f'&refresh={str(refresh)}'
        )

    except Exception as e:
        return redirect(f'{FRONTEND_URL}/#/')

# @api_view(['GET'])
# def search_user_accounts(request):
#     query = request.query_params.get('q', '')
#     if query:
#         users = UserProfile.objects.filter(username__istartswith=query).exclude(username=request.user.username)
#     else:
#         users = UserProfile.objects.none()
#     serializer = UserProfileSerializer(users, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_user_accounts(request):
    query = request.query_params.get('query', '')
    if query:
        users = UserProfile.objects.filter(username__icontains=query).exclude(username=request.user.username)
    else:
        users = UserProfile.objects.none()
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
