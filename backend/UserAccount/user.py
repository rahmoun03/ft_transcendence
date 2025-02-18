from django.http import FileResponse, Http404
from django.conf import settings
import os
import mimetypes

from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def getToken(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({"detail": "Authentication credentials were not provided."}, status=401)

    jwt_authenticator = JWTAuthentication()
    try:
        validated_token = jwt_authenticator.get_validated_token(token)
        user = jwt_authenticator.get_user(validated_token)
        profile_pic_url = user.uploaded_profile_pic.url if user.uploaded_profile_pic else None
        profile_pic = user.profile_pic

        if profile_pic_url:
            profile_pic = ''
        print(f"User: {vars(user)}")
        return Response({
            "username": user.username,
            "email": user.email,
            "profile_pic": profile_pic,
            "uploaded_profile_pic": profile_pic_url,
            "created_at": user.created_at,
            "friends_count": user.friends.count(),
            "is_active": user.is_active,
            'id': user.id,
            'score':user.score,
            'games_played': user.games_played,
            'avg': user.avg,
            'victories': user.victories,
            'win_rate': user.win_rate,
        })
        
    except Exception as e:
        print(f"Error: {str(e)}") 
        return Response({"detail": str(e)}, status=401)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    print(request.data.get('avatar'))
    refresh = RefreshToken.for_user(user)
    print('_______________', request.user.profile_pic)
    return JsonResponse({
        'token': str(refresh.access_token)
    })

class UpdateProfilePicView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @csrf_exempt
    def post(self, request):
        user = request.user
        profile_pic_file = request.FILES.get('avatar')

        if profile_pic_file:
            user.uploaded_profile_pic = profile_pic_file
            user.profile_pic = ''  # Clear URL field
            user.save()


        profile_pic_url = user.uploaded_profile_pic.url if user.uploaded_profile_pic else None
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'token': str(refresh.access_token),
            'avatar': profile_pic_url})



class ProfilePicView(APIView):
    def get(self, request, image_name):
        # Adjust the path to match the correct folder
        file_path = os.path.join(settings.MEDIA_ROOT, 'profile_pics', image_name)
        print(f"Requested image: {image_name}")

        # Check if the file exists
        if os.path.exists(file_path):
            content_type, _ = mimetypes.guess_type(file_path)
            content_type = content_type or 'application/octet-stream'

            # Return the file with FileResponse without manually opening it
            return FileResponse(open(file_path, 'rb'), content_type=content_type)

        raise Http404("Image not found")