from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.middleware.csrf import get_token
import json
from .models import UserProfile
from django.contrib.auth.models import User
# from rest_framework.decorators import api_view

def set_csrf_token(request):
    get_token(request)
    return JsonResponse({'detail': 'CSRF cookie set'})

def pingpong(request):
    return render(request, 'pingpong.html')

# @api_view(['POST'])
@csrf_exempt
def score_update(request):
    if 'score' not in request.session:
        request.session['score'] = 0
        request.session['avg'] = 0
        request.session['win_rate'] = 0
        request.session['games_played'] = 0
        request.session['victories'] = 0

    if request.method == 'POST':
        data = json.loads(request.body)
        score = data.get('score')
        victories = data.get('victories')
        lost = data.get('lost')

        request.session['score'] += score
        request.session['games_played'] += 1
        if (victories == 1):
            request.session['victories'] += 1
        request.session['win_rate'] = request.session['victories'] / request.session['games_played'] * 100
        request.session['avg'] = request.session['score'] / request.session['games_played']


    

    return JsonResponse({'games_played':request.session['games_played'], 
                         'victories' :request.session['victories'],
                         'win_rate': request.session['win_rate'],
                         'avg': request.session['avg']})

