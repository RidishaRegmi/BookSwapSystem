from django.urls import path
from . import views

urlpatterns = [
    path('', views.notification_list),
    path('<int:pk>/read/', views.mark_as_read),
]