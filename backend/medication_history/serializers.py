from rest_framework import serializers
from .models import MedicationHistory


class MedicationHistorySerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.medicine_name', read_only=True)
    medicine_dosage = serializers.CharField(source='medicine.dosage', read_only=True)
    reminder_time = serializers.CharField(source='reminder.reminder_time', read_only=True)

    class Meta:
        model = MedicationHistory
        fields = "__all__"
        read_only_fields = ("user", "date", "time", "created_at")
