from django.contrib import admin
from .models import Medicine


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):

    list_display = (
        "medicine_name",
        "user",
        "dosage",
        "medicine_type",
        "stock_quantity",
        "expiry_date",
    )

    search_fields = (
        "medicine_name",
        "user__username",
    )

    list_filter = (
        "medicine_type",
        "expiry_date",
    )