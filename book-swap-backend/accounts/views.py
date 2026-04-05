from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

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
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
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