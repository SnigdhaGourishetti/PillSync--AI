from django.contrib import admin
from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "medicine",
        "reminder_time",
        "repeat_type",
        "is_active",
    )

    list_filter = (
        "repeat_type",
        "is_active",
    )

    search_fields = (
        "user__username",
        "medicine__medicine_name",
    )