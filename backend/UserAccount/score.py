import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken




@csrf_exempt
def update_score(request):
    print(f"Request user: {request.user}, Auth Header: {request.headers.get('Authorization')}")

    if not request.user.is_authenticated:
        print("________________")
        return JsonResponse({'error': 'User not authenticated'}, status=401)

    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            user = request.user
            user.score = data.get('score', user.score)
            user.games_played = data.get('games_played', user.games_played)
            user.victories = data.get('victories', user.victories)
            user.win_rate = data.get('win_rate', user.win_rate)
            user.avg = data.get('points_per_game', user.avg)
            user.save()
            return JsonResponse({'message': 'User score updated successfully'})
        return JsonResponse({'error': "Invalid request method"}, status=405)
    except Exception as e:
        print(f"Error updating score: {e}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


def convert_to_number(value):
    """Helper function to convert value to a number or return None if invalid."""
    try:
        # Convert to float or integer (depending on the value)
        return float(value) if value not in [None, ''] else 0
    except ValueError:
        return 0  # Default to 0 if conve

class ScoreUpdate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @csrf_exempt
    def post(self, request):
        user = request.user

        data = json.loads(request.body)
        print(f"________________________Parsed data: {data}")

        user = request.user
        user.games_played = convert_to_number(data.get('games_played'))
        user.victories = convert_to_number(data.get('victories'))
        user.win_rate = convert_to_number(data.get('win_rate'))
        user.avg = convert_to_number(data.get('avg'))
        
        user.save()
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'token': str(refresh.access_token)})
# score
# games_played
# victories
# win_rate
# avg