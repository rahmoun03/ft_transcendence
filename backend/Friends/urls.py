from django.urls import path
from . import views

urlpatterns = [
    path('api/friend/request/', views.send_friend_request, name='send_friend_request'),
    path('api/friend/requests/', views.list_friend_requests, name='list_friend_requests'),
    path('api/friend/request/<int:request_id>/', views.handle_friend_request, name='handle_friend_request'),
    path('api/friends/', views.list_friends, name='list_friends'),
]