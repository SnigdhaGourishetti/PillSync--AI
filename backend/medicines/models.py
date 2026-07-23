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

    dose_times = models.JSONField(default=list, blank=True, null=True)

    SCHEDULE_CHOICES = [
        ("MORNING", "Morning"),
        ("AFTERNOON", "Afternoon"),
        ("NIGHT", "Night"),
        ("CUSTOM", "Custom"),
    ]

    schedule_type = models.CharField(
        max_length=20,
        choices=SCHEDULE_CHOICES,
        default="CUSTOM",
        blank=True,
        null=True
    )

    stock_quantity = models.PositiveIntegerField()

    low_stock_email_sent = models.BooleanField(default=False)

    expiry_date = models.DateField()

    instructions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.medicine_name

    def calculate_days_remaining(self):
        """
        Calculate estimated days remaining based on:
        - Current stock quantity
        - Frequency per day
        Assumes 1 unit per intake (1 tablet/capsule)
        """
        try:
            # Assume 1 unit per intake regardless of dosage mg
            dosage_per_intake = 1

            # Ensure frequency_per_day is at least 1
            frequency = self.frequency_per_day if self.frequency_per_day > 0 else 1

            daily_consumption = dosage_per_intake * frequency
            if daily_consumption == 0:
                daily_consumption = 1

            days_remaining = self.stock_quantity // daily_consumption
            return max(0, days_remaining)
        except Exception as e:
            print(f"Error calculating days remaining for {self.medicine_name}: {e}")
            return 0

    def is_low_stock(self, threshold_days=3):
        return self.calculate_days_remaining() <= threshold_days

    def decrement_stock(self, amount=1):
        self.stock_quantity = max(0, self.stock_quantity - amount)
        return self.stock_quantity