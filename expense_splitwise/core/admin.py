from django.contrib import admin
from .models import Group, ExpenseShare, Expense
# Register your models here.
admin.site.register(Group)
admin.site.register(ExpenseShare)
admin.site.register(Expense)

