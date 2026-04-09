from django.db import models
from django.conf import settings

CONDITION_CHOICES = [
    ('New', 'New'),
    ('Like New', 'Like New'),
    ('Good', 'Good'),
    ('Fair', 'Fair'),
    ('Poor', 'Poor'),
]

CATEGORY_CHOICES = [
    ('Fiction', 'Fiction'),
    ('Non-Fiction', 'Non-Fiction'),
    ('Science', 'Science'),
    ('History', 'History'),
    ('Technology', 'Technology'),
    ('Literature', 'Literature'),
    ('Other', 'Other'),
]

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    is_available_for_swap = models.BooleanField(default=True)
    listed_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='books')
    image = models.ImageField(upload_to='book_images/', null=True, blank=True)

    def __str__(self):
        return self.title


# wishlist model - users save book titles they want
# when a matching book is listed, they get notified
class WishlistItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    # store title and author as text so user can wish for any book
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # prevent duplicate wishlist entries for same user
        unique_together = ['user', 'title']

    def __str__(self):
        return f"{self.user} wants {self.title}"