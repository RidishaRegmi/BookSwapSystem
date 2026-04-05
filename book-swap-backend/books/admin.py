from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'condition', 'owner', 'is_available_for_swap', 'listed_at')
    list_filter = ('category', 'condition', 'is_available_for_swap')
    search_fields = ('title', 'author')