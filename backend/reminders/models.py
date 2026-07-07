from django.db import models
from django.conf import settings
from medicines.models import Medicine


class Reminder(models.Model):
    class RepeatType(models.TextChoices):
        DAILY = "DAILY", "Daily"
        WEEKLY = "WEEKLY", "Weekly"
        MONTHLY = "MONTHLY", "Monthly"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    reminder_time = models.TimeField()

    repeat_type = models.CharField(
        max_length=20,
        choices=RepeatType.choices,
        default=RepeatType.DAILY
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.medicine.medicine_name}"