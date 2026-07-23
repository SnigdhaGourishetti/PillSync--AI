from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Medicine
        fields = "__all__"
        read_only_fields = ("user",)

    def get_days_remaining(self, obj):
        return obj.calculate_days_remaining()