from django.urls import path
from . import views
from .score import *
from .user import *
from django.conf.urls.static import static

urlpatterns = [
    path('api/signup/', views.register, name='signup'),
    path('api/login/', views.login, name='login'),
    path('auth/login/', views.login_with_42, name='login_with_42'),
    path('api/auth/callback/', views.auth_callback, name='auth_callback'),
    path('api/getToken/', getToken, name='getToken'),
    # path('api/update_score/', update_score, name='update_score'),
    path('api/update_score/', ScoreUpdate.as_view(), name='update_score'),
    path('api/update_profile/', UpdateProfilePicView.as_view(), name='update_profile'),
    path('api/profile_pic/<str:image_name>/', ProfilePicView.as_view(), name='profile_pic'),
    path('search/', views.search_user_accounts, name='search_user_accounts'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
