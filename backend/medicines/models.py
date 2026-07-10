from django.db import models
from django.conf import settings


class Medicine(models.Model):

    MEDICINE_TYPES = [
        ("Tablet", "Tablet"),
        ("Capsule", "Capsule"),
        ("Syrup", "Syrup"),
        ("Injection", "Injection"),
        ("Drops", "Drops"),
        ("Ointment", "Ointment"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="medicines"
    )

    medicine_name = models.CharField(max_length=100)

    dosage = models.CharField(max_length=50)

    medicine_type = models.CharField(
        max_length=20,
        choices=MEDICINE_TYPES,
        default="Tablet"
    )

    frequency_per_day = models.PositiveIntegerField(default=1)

    stock_quantity = models.PositiveIntegerField()

    expiry_date = models.DateField()

    instructions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.medicine_name