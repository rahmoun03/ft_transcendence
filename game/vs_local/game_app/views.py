from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Create your views here.

def pingpong(request):
    return render(request, 'pingpong.html')
