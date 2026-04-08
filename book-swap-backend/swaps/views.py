from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import SwapRequest, SwapMessage
from .serializers import SwapRequestCreateSerializer, SwapRequestSerializer, SwapMessageSerializer
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
        Notification.objects.create(
            user=request.user,
            message=f'Your swap request for "{swap.requested_book.title}" by {swap.requested_book.owner.full_name or swap.requested_book.owner.username} has been sent successfully.',
        )
        return Response(SwapRequestSerializer(swap, context={'request': request}).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incoming_requests(request):
    swaps = SwapRequest.objects.filter(
        requested_book__owner=request.user
    ).select_related('requester', 'requested_book', 'offered_book')
    serializer = SwapRequestSerializer(swaps, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sent_requests(request):
    swaps = SwapRequest.objects.filter(
        requester=request.user
    ).select_related('requester', 'requested_book', 'offered_book')
    serializer = SwapRequestSerializer(swaps, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_swap_history(request):
    swaps = (
        SwapRequest.objects.filter(
            Q(requester=request.user)
            | Q(requested_book__owner=request.user)
            | Q(offered_book__owner=request.user)
        )
        .select_related('requester', 'requested_book', 'offered_book')
        .distinct()
        .order_by('-updated_at')
    )
    serializer = SwapRequestSerializer(swaps, many=True, context={'request': request})
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
    swap.requester_marked_completed = False
    swap.owner_marked_completed = False
    swap.save()
    owner_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=swap.requester,
        message=f'Your swap request for "{swap.requested_book.title}" has been accepted by {owner_name}.',
    )
    return Response(SwapRequestSerializer(swap, context={'request': request}).data)


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
    return Response(SwapRequestSerializer(swap, context={'request': request}).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_request(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if request.user != swap.requester and request.user != swap.requested_book.owner:
        return Response({'detail': 'Only participants can mark this as completed.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status not in ('Accepted', 'Completed'):
     return Response({'detail': 'Chat is not available for this swap.'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST' and swap.status != 'Accepted':
     return Response({'detail': 'Cannot send messages in a completed swap.'}, status=status.HTTP_400_BAD_REQUEST)

    if request.user == swap.requester:
        if swap.requester_marked_completed:
            return Response({'detail': 'You already marked this swap as completed.'}, status=status.HTTP_400_BAD_REQUEST)
        swap.requester_marked_completed = True
        other_user = swap.requested_book.owner
    else:
        if swap.owner_marked_completed:
            return Response({'detail': 'You already marked this swap as completed.'}, status=status.HTTP_400_BAD_REQUEST)
        swap.owner_marked_completed = True
        other_user = swap.requester

    if not (swap.requester_marked_completed and swap.owner_marked_completed):
        swap.save(update_fields=['requester_marked_completed', 'owner_marked_completed', 'updated_at'])
        marker_name = request.user.full_name or request.user.username
        Notification.objects.create(
            user=other_user,
            message=f'{marker_name} marked the swap as completed. Please confirm to finish the transaction.',
        )
        return Response(SwapRequestSerializer(swap, context={'request': request}).data)

    # Both parties confirmed completion: transfer ownership and finalize.
    requested_book_old_owner = swap.requested_book.owner
    offered_book_old_owner = swap.offered_book.owner

    swap.requested_book.owner = offered_book_old_owner
    swap.offered_book.owner = requested_book_old_owner

    swap.status = 'Completed'
    swap.save()
    # After ownership transfer, both books remain swappable for future swaps.
    swap.requested_book.is_available_for_swap = True
    swap.requested_book.save()
    swap.offered_book.is_available_for_swap = True
    swap.offered_book.save()
    Notification.objects.create(
        user=swap.requester,
        message=f'Your swap for "{swap.requested_book.title}" is fully completed.',
    )
    Notification.objects.create(
        user=swap.requested_book.owner,
        message=f'Your swap for "{swap.offered_book.title}" is fully completed.',
    )
    return Response(SwapRequestSerializer(swap, context={'request': request}).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_request(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if request.user != swap.requester and request.user != swap.requested_book.owner:
        return Response({'detail': 'Only participants can cancel this swap.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Accepted':
        return Response({'detail': 'Only accepted swaps can be cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

    swap.status = 'Cancelled'
    swap.requester_marked_completed = False
    swap.owner_marked_completed = False
    swap.save(update_fields=['status', 'requester_marked_completed', 'owner_marked_completed', 'updated_at'])

    other_user = swap.requested_book.owner if request.user == swap.requester else swap.requester
    canceller_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=other_user,
        message=f'{canceller_name} cancelled the active swap for "{swap.requested_book.title}".',
    )
    Notification.objects.create(
        user=request.user,
        message=f'You cancelled the active swap for "{swap.requested_book.title}".',
    )
    return Response(SwapRequestSerializer(swap, context={'request': request}).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def save_meetup_note(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if request.user != swap.requester and request.user != swap.requested_book.owner:
        return Response({'detail': 'Only participants can add a meetup note.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Accepted':
        return Response({'detail': 'Meetup note can only be added to accepted swaps.'}, status=status.HTTP_400_BAD_REQUEST)
    swap.meetup_note = request.data.get('meetup_note', '')
    swap.save()

    if request.user == swap.requester:
        other_user = swap.requested_book.owner
    else:
        other_user = swap.requester

    sender_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=other_user,
        message=f'{sender_name} left a meetup note: "{swap.meetup_note}"',
    )
    return Response(SwapRequestSerializer(swap, context={'request': request}).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def swap_messages(request, pk):
    swap = get_object_or_404(SwapRequest, pk=pk)
    if request.user != swap.requester and request.user != swap.requested_book.owner:
        return Response({'detail': 'Only participants can access chat.'}, status=status.HTTP_403_FORBIDDEN)
    if swap.status != 'Accepted':
        return Response({'detail': 'Chat is available only for active (accepted) swaps.'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        messages = swap.messages.select_related('sender').all()
        serializer = SwapMessageSerializer(messages, many=True)
        return Response(serializer.data)

    content = (request.data.get('content') or '').strip()
    if not content:
        return Response({'detail': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

    message = SwapMessage.objects.create(
        swap=swap,
        sender=request.user,
        content=content,
    )

    if request.user == swap.requester:
        other_user = swap.requested_book.owner
    else:
        other_user = swap.requester

    sender_name = request.user.full_name or request.user.username
    Notification.objects.create(
        user=other_user,
        message=f'{sender_name} sent you a chat message for swap "{swap.requested_book.title}".',
    )
    return Response(SwapMessageSerializer(message).data, status=status.HTTP_201_CREATED)