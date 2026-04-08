from django.db import models
from django.conf import settings

STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Accepted', 'Accepted'),
    ('Rejected', 'Rejected'),
    ('Cancelled', 'Cancelled'),
    ('Completed', 'Completed'),
]

class SwapRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_swap_requests')
    requested_book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='swap_requests_received')
    offered_book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='swap_requests_offered')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    message = models.TextField(blank=True)
    meetup_note = models.TextField(blank=True, null=True)
    requester_marked_completed = models.BooleanField(default=False)
    owner_marked_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.requester} wants {self.requested_book} for {self.offered_book}"


class SwapMessage(models.Model):
    swap = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='swap_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message by {self.sender} on swap {self.swap_id}"