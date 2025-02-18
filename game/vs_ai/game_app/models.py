from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import User

class UserProfile(models.Model):
    # user_id = models.IntegerField(unique=True)
    games_played = models.IntegerField(default=0)
    victories = models.IntegerField(default=0)
    win_rate = models.IntegerField(default=0)
    avg = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"UserProfile {self.id}"

    # Optionally, add methods to update the fields based on other values
    def update_win_rate(self):
        if self.games_played > 0:
            self.win_rate = (self.victories / self.games_played) * 100
        else:
            self.win_rate = 0
        self.save()

    def update_avg_score(self):
        if self.games_played > 0:
            self.avg = self.score / self.games_played
        else:
            self.avg = 0
        self.save()



