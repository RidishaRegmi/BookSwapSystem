from rest_framework import serializers
from django.db.models import Q
from .models import SwapRequest, SwapMessage


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

        requested_book_in_active_swap = SwapRequest.objects.filter(
            Q(requested_book=requested_book) | Q(offered_book=requested_book),
            status='Accepted',
        ).exists()
        if requested_book_in_active_swap:
            raise serializers.ValidationError("The requested book is already in an active swap.")

        offered_book_in_active_swap = SwapRequest.objects.filter(
            Q(requested_book=offered_book) | Q(offered_book=offered_book),
            status='Accepted',
        ).exists()
        if offered_book_in_active_swap:
            raise serializers.ValidationError("Your offered book is already in an active swap.")

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
    requested_book_image = serializers.SerializerMethodField()
    offered_book_image = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()

    class Meta:
        model = SwapRequest
        fields = (
            'id', 'requester', 'requester_name', 'requested_book',
            'requested_book_title', 'requested_book_image', 'offered_book',
            'offered_book_title', 'offered_book_image', 'recipient_name',
            'status', 'message', 'meetup_note',
            'requester_marked_completed', 'owner_marked_completed',
            'created_at', 'updated_at',
        )

    def get_requester_name(self, obj):
        return obj.requester.full_name or obj.requester.username

    def get_requested_book_title(self, obj):
        return obj.requested_book.title

    def get_offered_book_title(self, obj):
        return obj.offered_book.title

    def get_requested_book_image(self, obj):
        request = self.context.get('request')
        if obj.requested_book.image:
            if request:
                return request.build_absolute_uri(obj.requested_book.image.url)
            return obj.requested_book.image.url
        return None

    def get_offered_book_image(self, obj):
        request = self.context.get('request')
        if obj.offered_book.image:
            if request:
                return request.build_absolute_uri(obj.offered_book.image.url)
            return obj.offered_book.image.url
        return None

    def get_recipient_name(self, obj):
        return obj.requested_book.owner.full_name or obj.requested_book.owner.username


class SwapMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = SwapMessage
        fields = ('id', 'swap', 'sender', 'sender_name', 'content', 'created_at')
        read_only_fields = ('id', 'swap', 'sender', 'sender_name', 'created_at')

    def get_sender_name(self, obj):
        return obj.sender.full_name or obj.sender.username