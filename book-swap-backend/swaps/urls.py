from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_swap_request),
    path('incoming/', views.incoming_requests),
    path('sent/', views.sent_requests),
    path('<int:pk>/accept/', views.accept_request),
    path('<int:pk>/reject/', views.reject_request),
    path('<int:pk>/complete/', views.complete_request),
    path('<int:pk>/meetup-note/', views.save_meetup_note),
]