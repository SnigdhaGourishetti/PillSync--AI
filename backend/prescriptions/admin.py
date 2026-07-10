from django.contrib import admin
from .models import Prescription


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "doctor_name",
        "hospital_name",
        "prescription_date",
    )

    search_fields = (
        "doctor_name",
        "hospital_name",
        "user__username",
    )