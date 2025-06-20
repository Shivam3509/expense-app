from django.urls import path
from .views import (
    GroupListCreateView, GroupDetailView,
    ExpenseListCreateView, ExpenseDetailView, SettlementCreateView, UserListAPIView
)

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('groups/', GroupListCreateView.as_view(), name='groups'),
    path('groups/<uuid:pk>/', GroupDetailView.as_view(), name='group-detail'),
    path('expenses/', ExpenseListCreateView.as_view(), name='expenses'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    path('settlements/', SettlementCreateView.as_view(), name='settlements'),
]