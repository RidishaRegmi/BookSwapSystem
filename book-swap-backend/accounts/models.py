from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    full_name = models.CharField(max_length=255, blank=True)
    is_admin = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True)
    is_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email