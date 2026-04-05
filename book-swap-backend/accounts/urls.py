from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('profile/', views.profile_view),
    path('admin/users/', views.admin_list_users),
    path('admin/users/<int:pk>/', views.admin_remove_user),
    path('admin/users/<int:pk>/block/', views.admin_block_user),
    path('admin/books/', views.admin_list_books),
    path('admin/books/<int:pk>/', views.admin_remove_book),
]