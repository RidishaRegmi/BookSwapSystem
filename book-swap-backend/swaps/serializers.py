from rest_framework import serializers
from .models import SwapRequest


class SwapRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = ('requested_book', 'offered_book', 'message')

    def validate(self, data):
        request = self.context['request']
        requested_book = data['requested_book']
        offered_book = data['offered_book']

        if requested_book.owner == request.user:
            raise serializers.ValidationError("You cannot request a swap for your own book.")
        if offered_book.owner != request.user:
            raise serializers.ValidationError("You can only offer books you own.")
        if not requested_book.is_available_for_swap:
            raise serializers.ValidationError("The requested book is not available for swap.")
        if not offered_book.is_available_for_swap:
            raise serializers.ValidationError("Your offered book is not available for swap.")

        existing = SwapRequest.objects.filter(
            requester=request.user,
            requested_book=requested_book,
            offered_book=offered_book,
            status='Pending',
        ).exists()
        if existing:
            raise serializers.ValidationError("You already have a pending swap request for this book pair.")
        return data


class SwapRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField()
    requested_book_title = serializers.SerializerMethodField()
    offered_book_title = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()

    class Meta:
        model = SwapRequest
        fields = (
            'id', 'requester', 'requester_name', 'requested_book',
            'requested_book_title', 'offered_book', 'offered_book_title',
            'recipient_name', 'status', 'message', 'created_at', 'updated_at',
        )

    def get_requester_name(self, obj):
        return obj.requester.full_name or obj.requester.username

    def get_requested_book_title(self, obj):
        return obj.requested_book.title

    def get_offered_book_title(self, obj):
        return obj.offered_book.title

    def get_recipient_name(self, obj):
        return obj.requested_book.owner.full_name or obj.requested_book.owner.username