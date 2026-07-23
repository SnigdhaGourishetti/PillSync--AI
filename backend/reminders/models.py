import calendar
from django.db import models
from django.conf import settings
from django.utils import timezone
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

    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("TAKEN", "Taken"),
            ("MISSED", "Missed"),
            ("SNOOZED", "Snoozed"),
        ],
        default="PENDING"
    )

    snooze_until = models.DateTimeField(blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    initial_date = models.DateField(blank=True, null=True)
    last_reminder_sent_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.medicine.medicine_name}"

    def save(self, *args, **kwargs):
        if not self.initial_date:
            self.initial_date = timezone.now().date()
        super().save(*args, **kwargs)

    def get_schedule_start_date(self):
        if self.initial_date:
            return self.initial_date
        if self.created_at:
            return self.created_at.date()
        return timezone.now().date()

    def matches_schedule_for_date(self, target_date):
        start_date = self.get_schedule_start_date()
        if self.repeat_type == self.RepeatType.DAILY:
            return True
        if self.repeat_type == self.RepeatType.WEEKLY:
            return target_date.weekday() == start_date.weekday()
        if self.repeat_type == self.RepeatType.MONTHLY:
            start_day = start_date.day
            last_day = calendar.monthrange(target_date.year, target_date.month)[1]
            return target_date.day == start_day or (start_day > last_day and target_date.day == last_day)
        return False

    def has_sent_for_current_occurrence(self, now):
        if not self.last_reminder_sent_at:
            return False

        last_sent_date = self.last_reminder_sent_at.date()
        if self.repeat_type == self.RepeatType.DAILY:
            return last_sent_date == now.date()
        if self.repeat_type == self.RepeatType.WEEKLY:
            return last_sent_date.isocalendar()[:2] == now.date().isocalendar()[:2]
        if self.repeat_type == self.RepeatType.MONTHLY:
            return last_sent_date.year == now.year and last_sent_date.month == now.month
        return False

    def mark_reminder_sent(self, now):
        self.last_reminder_sent_at = now
        self.save(update_fields=["last_reminder_sent_at"])
