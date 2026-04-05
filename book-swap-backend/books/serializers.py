from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_location = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = (
            'id', 'title', 'author', 'description', 'condition', 'category',
            'is_available_for_swap', 'listed_at', 'owner', 'owner_name',
            'owner_location', 'image',
        )
        read_only_fields = ('id', 'listed_at', 'owner')

    def get_owner_name(self, obj):
        return obj.owner.full_name or obj.owner.username

    def get_owner_location(self, obj):
        return obj.owner.location


class BookListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_location = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = (
            'id', 'title', 'author', 'condition', 'category',
            'owner_name', 'owner_location', 'image', 'listed_at',
        )

    def get_owner_name(self, obj):
        return obj.owner.full_name or obj.owner.username

    def get_owner_location(self, obj):
        return obj.owner.location