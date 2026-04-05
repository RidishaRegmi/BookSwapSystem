from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Book
from .serializers import BookSerializer, BookListSerializer


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
        location = request.query_params.get('location')
        if location:
            books = books.filter(owner__location__icontains=location)
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)

    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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