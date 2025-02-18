from django.db import models
from django.contrib.auth.models import User
from UserAccount.models import UserProfile
from django.db import transaction
from django.core.exceptions import ValidationError


class FriendRequest(models.Model):
    STATUSES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected')
    )
    
    sender = models.ForeignKey(UserProfile, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(UserProfile, related_name='received_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUSES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-created_at']

    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("Cannot send friend request to yourself")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

