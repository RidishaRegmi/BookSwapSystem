from django.urls import path
from . import views

urlpatterns = [
    path('', views.book_list_create),
    path('my-books/', views.my_books),
    path('<int:pk>/', views.book_detail),
    path('<int:pk>/update/', views.book_update),
    path('<int:pk>/delete/', views.book_delete),
]