from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import SwapRequest
from .serializers import SwapRequestCreateSerializer, SwapRequestSerializer
from notifications.models import Notification


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_swap_request(request):
    serializer = SwapRequestCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        swap = serializer.save(requester=request.user)
        Notification.objects.create(
            user=swap.requested_book.owner,
            message=f'{request.user.full_name or request.user.username} sent you a swap request for your book "{swap.requested_book.title}".',
        )
        return Response(SwapRequestSerializer(swap).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incoming_requests(request):
    swaps = SwapRequest.objects.filter(
        requested_book__owner=request.user
    ).select_related('requester', 'requested_book', 'offered_book')
    serializer = SwapRequestSerializer(swaps, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sent_requests(request):
    swaps = SwapRequest.objects.filter(
        requester=request.user
    ).select_related('requester', 'requested_book', 'offered_book')
    serializer = SwapRequestSerializer(swaps, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def accept_request(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if swap.requested_book.owner != request.user:
        return Response({'detail': 'Only the book owner can accept this request.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Pending':
        return Response({'detail': 'This request is no longer pending.'}, status=status.HTTP_400_BAD_REQUEST)
    swap.status = 'Accepted'
    swap.save()
    owner_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=swap.requester,
        message=f'Your swap request for "{swap.requested_book.title}" has been accepted by {owner_name}.',
    )
    return Response(SwapRequestSerializer(swap).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reject_request(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if swap.requested_book.owner != request.user:
        return Response({'detail': 'Only the book owner can reject this request.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Pending':
        return Response({'detail': 'This request is no longer pending.'}, status=status.HTTP_400_BAD_REQUEST)
    swap.status = 'Rejected'
    swap.save()
    owner_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=swap.requester,
        message=f'{owner_name} rejected your swap request for "{swap.requested_book.title}".',
    )
    return Response(SwapRequestSerializer(swap).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_request(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if request.user != swap.requester and request.user != swap.requested_book.owner:
        return Response({'detail': 'Only participants can mark this as completed.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Accepted':
        return Response({'detail': 'Only accepted requests can be completed.'}, status=status.HTTP_400_BAD_REQUEST)
    swap.status = 'Completed'
    swap.save()
    swap.requested_book.is_available_for_swap = False
    swap.requested_book.save()
    swap.offered_book.is_available_for_swap = False
    swap.offered_book.save()
    Notification.objects.create(
        user=swap.requester,
        message=f'Your swap for "{swap.requested_book.title}" has been marked as completed.',
    )
    Notification.objects.create(
        user=swap.requested_book.owner,
        message=f'Your swap for "{swap.offered_book.title}" has been marked as completed.',
    )
    return Response(SwapRequestSerializer(swap).data)