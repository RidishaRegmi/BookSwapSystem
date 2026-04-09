from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Book, WishlistItem
from django.db import models
from .serializers import BookSerializer, BookListSerializer
import math


def calculate_distance(lat1, lng1, lat2, lng2):
    # haversine formula to calculate distance between two coordinates in km
    R = 6371
    lat1, lng1, lat2, lng2 = map(math.radians, [float(lat1), float(lng1), float(lat2), float(lng2)])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def book_list_create(request):
    if request.method == 'GET':
        books = Book.objects.filter(is_available_for_swap=True).select_related('owner')
        search = request.query_params.get('search')
        if search:
            books = books.filter(Q(title__icontains=search) | Q(author__icontains=search))
        category = request.query_params.get('category')
        if category:
            books = books.filter(category=category)
        condition = request.query_params.get('condition')
        if condition:
            books = books.filter(condition=condition)

        books_list = list(books)

        sort_by_distance = request.query_params.get('sort_by_distance')
        user_lat = request.query_params.get('user_lat')
        user_lng = request.query_params.get('user_lng')

        result = []
        for book in books_list:
            image_url = None
            if book.image:
                image_url = request.build_absolute_uri(book.image.url)

            distance = None
            if user_lat and user_lng and book.owner.lat and book.owner.lng:
                try:
                    distance = round(calculate_distance(
                        user_lat, user_lng,
                        book.owner.lat, book.owner.lng
                    ), 1)
                except Exception:
                    distance = None

            result.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'category': book.category,
                'condition': book.condition,
                'description': book.description,
                'image': image_url,
                'is_available_for_swap': book.is_available_for_swap,
                'listed_at': book.listed_at,
                'distance_km': distance,
                'owner': {
                    'id': book.owner.id,
                    'full_name': book.owner.full_name,
                    'email': book.owner.email,
                    'city': book.owner.city,
                }
            })

        if sort_by_distance == 'true' and user_lat and user_lng:
            result.sort(key=lambda x: x['distance_km'] if x['distance_km'] is not None else 99999)

        return Response(result)

    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        book = serializer.save(owner=request.user)

        # after saving the new book, check if anyone has it on their wishlist
        # and send them a notification
        notify_wishlist_users(book, request)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def notify_wishlist_users(book, request):
    # find all wishlist items that match this book's title or author
    # exclude the person who just listed the book
    matching_wishlists = WishlistItem.objects.filter(
        Q(title__icontains=book.title) | Q(author__icontains=book.author)
    ).exclude(
        user=book.owner
    ).select_related('user')

    if not matching_wishlists.exists():
        return

    # import here to avoid circular imports
    from notifications.models import Notification

    # send a notification to each user who wanted this book
    for wishlist_item in matching_wishlists:
        Notification.objects.create(
            user=wishlist_item.user,
            message=f'A book on your wishlist is now available! "{book.title}" by {book.author} has been listed for swap.'
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_books(request):
    books = Book.objects.filter(owner=request.user)
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    serializer = BookSerializer(book)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def book_update(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if book.owner != request.user:
        return Response({'detail': 'You can only edit your own books.'}, status=status.HTTP_403_FORBIDDEN)
    serializer = BookSerializer(book, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def book_delete(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if book.owner != request.user:
        return Response({'detail': 'You can only delete your own books.'}, status=status.HTTP_403_FORBIDDEN)
    book.delete()
    return Response({'message': 'Book deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_list(request):
    # get all wishlist items for the current user
    items = WishlistItem.objects.filter(user=request.user)
    result = [
        {
            'id': item.id,
            'title': item.title,
            'author': item.author,
            'created_at': item.created_at,
        }
        for item in items
    ]
    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_add(request):
    title = request.data.get('title', '').strip()
    author = request.data.get('author', '').strip()

    if not title:
        return Response({'detail': 'Title is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # check if already in wishlist
    if WishlistItem.objects.filter(user=request.user, title__iexact=title).exists():
        return Response({'detail': 'Already in your wishlist.'}, status=status.HTTP_400_BAD_REQUEST)

    item = WishlistItem.objects.create(
        user=request.user,
        title=title,
        author=author,
    )
    return Response({
        'id': item.id,
        'title': item.title,
        'author': item.author,
        'created_at': item.created_at,
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_remove(request, pk):
    item = get_object_or_404(WishlistItem, pk=pk, user=request.user)
    item.delete()
    return Response({'message': 'Removed from wishlist.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommendations(request):
    from swaps.models import SwapRequest
    from collections import Counter

    user = request.user

    completed_swaps = SwapRequest.objects.filter(
        status='Completed'
    ).filter(
        models.Q(requester=user) |
        models.Q(requested_book__owner=user) |
        models.Q(offered_book__owner=user)
    ).select_related('requested_book', 'offered_book')

    category_counter = Counter()
    author_counter = Counter()

    for swap in completed_swaps:
        for book in [swap.requested_book, swap.offered_book]:
            if book.category:
                category_counter[book.category] += 1
            if book.author:
                author_counter[book.author] += 1

    user_book_ids = Book.objects.filter(owner=user).values_list('id', flat=True)
    recommended = []

    if category_counter:
        top_categories = [cat for cat, _ in category_counter.most_common(3)]
        top_authors = [auth for auth, _ in author_counter.most_common(3)]
        recommended = list(
            Book.objects.filter(
                is_available_for_swap=True
            ).exclude(
                owner=user
            ).exclude(
                id__in=user_book_ids
            ).filter(
                models.Q(category__in=top_categories) |
                models.Q(author__in=top_authors)
            ).select_related('owner').order_by('-listed_at')[:20]
        )

    if not recommended:
        recommended = list(
            Book.objects.filter(
                is_available_for_swap=True
            ).exclude(
                owner=user
            ).select_related('owner').order_by('-listed_at')[:20]
        )

    result = []
    for book in recommended:
        image_url = None
        if book.image:
            image_url = request.build_absolute_uri(book.image.url)

        distance = None
        if user.lat and user.lng and book.owner.lat and book.owner.lng:
            try:
                distance = round(calculate_distance(
                    user.lat, user.lng,
                    book.owner.lat, book.owner.lng
                ), 1)
            except Exception:
                distance = None

        result.append({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'category': book.category,
            'condition': book.condition,
            'description': book.description,
            'image': image_url,
            'is_available_for_swap': book.is_available_for_swap,
            'listed_at': book.listed_at,
            'distance_km': distance,
            'owner': {
                'id': book.owner.id,
                'full_name': book.owner.full_name,
                'email': book.owner.email,
                'city': book.owner.city,
            }
        })

    is_personalized = len(category_counter) > 0

    return Response({
        'is_personalized': is_personalized,
        'top_categories': [cat for cat, _ in category_counter.most_common(3)],
        'recommendations': result,
    })