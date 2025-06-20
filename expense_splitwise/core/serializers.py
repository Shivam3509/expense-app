from rest_framework import serializers
from .models import Group, Expense, ExpenseShare, Settlement
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ExpenseShareSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ExpenseShare
        fields = ['user', 'share']

class ExpenseSerializer(serializers.ModelSerializer):
    shares = ExpenseShareSerializer(many=True, read_only=True)
    paid_by = UserSerializer(read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'group', 'description', 'amount', 'paid_by', 'date', 'shares']

class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = '__all__'
        read_only_fields = ['created_by', 'invite_code']

    def get_members(self, obj):
        return [{"id": user.id, "username": user.username} for user in obj.members.all()]

class ExpenseCreateSerializer(serializers.ModelSerializer):
    split_between = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    split_type = serializers.ChoiceField(choices=[("equal", "Equal"), ("custom", "Custom")], write_only=True)
    custom_shares = serializers.DictField(child=serializers.FloatField(), required=False, write_only=True)

    class Meta:
        model = Expense
        fields = ['group', 'description', 'amount', 'split_type', 'split_between', 'custom_shares']

    def create(self, validated_data):
        split_type = validated_data.pop('split_type')
        split_between = validated_data.pop('split_between')
        custom_shares = validated_data.pop('custom_shares', None)

        expense = Expense.objects.create(**validated_data)

        if split_type == 'equal':
            share_amount = round(expense.amount / len(split_between), 2)
            for user_id in split_between:
                ExpenseShare.objects.create(
                    expense=expense,
                    user_id=user_id,
                    share=share_amount
                )

        elif split_type == 'custom':
            total_custom = sum(custom_shares.values())
            if round(total_custom, 2) != round(expense.amount, 2):
                raise serializers.ValidationError("Custom shares must total the full expense amount.")
            for user_id_str, amount in custom_shares.items():
                ExpenseShare.objects.create(
                    expense=expense,
                    user_id=int(user_id_str),
                    share=amount
                )

        return expense

class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = '__all__'


