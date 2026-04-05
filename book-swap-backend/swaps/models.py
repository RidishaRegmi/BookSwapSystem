from django.db import models
from django.conf import settings

STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Accepted', 'Accepted'),
    ('Rejected', 'Rejected'),
    ('Completed', 'Completed'),
]

class SwapRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_swap_requests')
    requested_book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='swap_requests_received')
    offered_book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='swap_requests_offered')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.requester} wants {self.requested_book} for {self.offered_book}"