from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserProfileManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class UserProfile(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    friends = models.ManyToManyField('self', symmetrical=False, blank=True)
    # profile_pic = models.CharField(max_length=255, blank=True, null=True) 

    games_played = models.IntegerField(default=0)
    victories = models.IntegerField(default=0)
    win_rate = models.IntegerField(default=0)
    avg = models.IntegerField(default=0)
    
    profile_pic = models.URLField(blank=True, null=True)  # Default URL for profile_pic

    uploaded_profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def get_profile_pic(self):
        return self.uploaded_profile_pic.url if self.uploaded_profile_pic else self.profile_pic
    

    games_played = models.IntegerField(default=0)
    victories = models.IntegerField(default=0)
    win_rate = models.IntegerField(default=0)
    avg = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserProfileManager()

    def __str__(self):
        return self.username
