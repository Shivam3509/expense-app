from urllib import response
from rest_framework import generics, permissions
from .models import Group, Expense
from .serializers import (
    GroupSerializer, ExpenseSerializer,
    ExpenseCreateSerializer, SettlementSerializer, UserSerializer
)
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] 

# GROUPS
class GroupListCreateView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        invite_code = get_random_string(length=8)
        group = serializer.save(created_by=self.request.user, invite_code=invite_code)
        group.members.add(self.request.user)
        member_usernames = self.request.data.get('member_usernames', [])
        if isinstance(member_usernames, list):
            users = User.objects.filter(username__in=member_usernames).exclude(id=self.request.user.id)
            group.members.add(*users)

class GroupDetailView(generics.RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# EXPENSES
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ExpenseCreateSerializer
        return ExpenseSerializer

    def perform_create(self, serializer):
        serializer.save(paid_by=self.request.user)

class ExpenseDetailView(generics.RetrieveAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

# SETTLEMENTS
class SettlementCreateView(generics.CreateAPIView):
    serializer_class = SettlementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
