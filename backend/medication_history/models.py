from django.db import models
from django.conf import settings
from medicines.models import Medicine
from reminders.models import Reminder


class MedicationHistory(models.Model):
    STATUS_CHOICES = [
        ("TAKEN", "Taken"),
        ("MISSED", "Missed"),
        ("SNOOZED", "Snoozed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="medication_history"
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="medication_history"
    )

    reminder = models.ForeignKey(
        Reminder,
        on_delete=models.CASCADE,
        related_name="medication_history",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
    )

    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.medicine.medicine_name} - {self.status}"

    class Meta:
        ordering = ['-created_at']
