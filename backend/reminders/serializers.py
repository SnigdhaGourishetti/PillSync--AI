from rest_framework import serializers
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.medicine_name', read_only=True)

    class Meta:
        model = Reminder
        fields = "__all__"
        read_only_fields = ("user", "created_at", "updated_at")