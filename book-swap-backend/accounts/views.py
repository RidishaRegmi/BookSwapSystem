from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer, AdminUserSerializer
from .permissions import IsAdminUser


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'is_admin': user.is_admin,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'is_admin': user.is_admin,
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_list_users(request):
    users = User.objects.all()
    serializer = AdminUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_remove_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    user.delete()
    return Response({'message': 'User removed successfully'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_block_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    user.is_blocked = True
    user.save()
    Token.objects.filter(user=user).delete()
    return Response({'message': 'User blocked successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_list_books(request):
    from books.models import Book
    from books.serializers import BookSerializer
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_remove_book(request, pk):
    from books.models import Book
    book = get_object_or_404(Book, pk=pk)
    book.delete()
    return Response({'message': 'Book removed successfully'}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    user = request.user
    if 'profile_image' not in request.FILES:
        return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
    user.profile_image = request.FILES['profile_image']
    user.save()
    serializer = UserProfileSerializer(user, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_locations(request):
    """
    Returns list of users with location coordinates for the map.
    Only includes users who have successfully saved lat/lng.
    """
    users = User.objects.filter(
        lat__isnull=False,
        lng__isnull=False
    ).values('id', 'full_name', 'email', 'city', 'lat', 'lng')

    result = [
        {
            "id": u['id'],
            "name": u['full_name'] or u['email'].split('@')[0],
            "city": u['city'] or "Nepal",
            "lat": float(u['lat']),
            "lng": float(u['lng']),
        }
        for u in users
    ]

    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def map_user_profile(request, pk):
    from books.models import Book
    from swaps.models import SwapRequest

    user = get_object_or_404(User, pk=pk)
    books = Book.objects.filter(owner=user, is_available_for_swap=True)
    swap_history = SwapRequest.objects.filter(
        Q(requester=user) | Q(requested_book__owner=user) | Q(offered_book__owner=user)
    ).select_related('requester', 'requested_book', 'offered_book', 'requested_book__owner').order_by('-created_at')[:20]

    active_swap = SwapRequest.objects.filter(
        status='Accepted'
    ).filter(
        requester=request.user,
        requested_book__owner=user
    ).first() or SwapRequest.objects.filter(
        status='Accepted'
    ).filter(
        requester=user,
        requested_book__owner=request.user
    ).first()

    profile_image = None
    if user.profile_image:
        profile_image = request.build_absolute_uri(user.profile_image.url)

    return Response({
        'id': user.id,
        'name': user.full_name or user.email.split('@')[0],
        'city': user.city or 'Nepal',
        'profile_image': profile_image,
        'available_books': [
            {
                'id': b.id,
                'title': b.title,
                'author': b.author,
                'condition': b.condition,
            }
            for b in books
        ],
        'swap_history': [
            {
                'id': s.id,
                'status': s.status,
                'requested_book_title': s.requested_book.title,
                'offered_book_title': s.offered_book.title,
                'counterparty_name': (
                    (s.requested_book.owner.full_name or s.requested_book.owner.username)
                    if s.requester == user
                    else (s.requester.full_name or s.requester.username)
                ),
                'created_at': s.created_at,
            }
            for s in swap_history
        ],
        'active_swap_id': active_swap.id if active_swap else None,
    })