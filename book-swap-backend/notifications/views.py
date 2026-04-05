from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    notification = get_object_or_404(Notification, pk=pk)
    if notification.user != request.user:
        return Response({'detail': 'Not your notification.'}, status=status.HTTP_403_FORBIDDEN)
    notification.is_read = True
    notification.save()
    return Response(NotificationSerializer(notification).data)