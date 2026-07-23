from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from reminders.models import Reminder
from utils.email_utils import send_reminder_email


class Command(BaseCommand):
    help = "Send reminder emails for active reminders whose scheduled time occurs now."

    def handle(self, *args, **options):
        now_utc = timezone.now()
        # Convert to local time zone
        local_tz = timezone.get_current_timezone()
        now_local = now_utc.astimezone(local_tz)
        today_local = now_local.date()
        tolerance = getattr(settings, "REMINDER_EMAIL_TOLERANCE_MINUTES", 1)

        self.stdout.write(f"Running send_reminder_emails at UTC: {now_utc.isoformat()}, Local: {now_local.isoformat()}")
        self.stdout.write(f"Today's date (local): {today_local}")
        self.stdout.write(f"Current time part (local): {now_local.time()}")

        time_window_start = (datetime.combine(today_local, now_local.time()) - timedelta(minutes=tolerance)).time()
        time_window_end = (datetime.combine(today_local, now_local.time()) + timedelta(minutes=tolerance)).time()
        self.stdout.write(f"Time window: {time_window_start} to {time_window_end}")

        # First get ALL active reminders to debug
        all_active_reminders = Reminder.objects.filter(is_active=True).select_related("user", "medicine")
        self.stdout.write(f"\nTotal active reminders in DB: {all_active_reminders.count()}")
        for r in all_active_reminders:
            self.stdout.write(f"  Reminder {r.id}: user={r.user.username}, time={r.reminder_time}, status={r.status}, active={r.is_active}")

        candidate_reminders = Reminder.objects.filter(
            reminder_time__gte=time_window_start,
            reminder_time__lte=time_window_end,
            is_active=True,
        ).filter(
            Q(status="PENDING") | Q(status="SNOOZED", snooze_until__lte=now_utc)
        ).select_related("user", "medicine")
        self.stdout.write(f"\nCandidate reminders (matching time window): {candidate_reminders.count()}")

        sent_count = 0
        skipped_count = 0
        error_count = 0

        for reminder in candidate_reminders:
            self.stdout.write(f"\nProcessing reminder {reminder.id}")
            if not reminder.matches_schedule_for_date(today_local):
                self.stdout.write(f"  Skipped: does not match schedule for {today_local}")
                skipped_count += 1
                continue

            if reminder.has_sent_for_current_occurrence(now_utc):
                self.stdout.write(self.style.WARNING(
                    f"Skipping already-sent reminder {reminder.id} for {reminder.user.username}"
                ))
                skipped_count += 1
                continue

            user_email = reminder.user.email
            if not user_email:
                self.stdout.write(self.style.WARNING(
                    f"Skipped reminder {reminder.id}: no email for user {reminder.user.username}"
                ))
                skipped_count += 1
                continue

            success, message = send_reminder_email(
                user_email=user_email,
                user_name=reminder.user.username,
                medicine_name=reminder.medicine.medicine_name,
                dosage=reminder.medicine.dosage,
                reminder_time=reminder.reminder_time.strftime("%I:%M %p"),
            )

            if success:
                reminder.mark_reminder_sent(now_utc)
                self.stdout.write(self.style.SUCCESS(
                    f"Email sent to {user_email} for reminder {reminder.id} ({reminder.medicine.medicine_name})"
                ))
                sent_count += 1
            else:
                self.stdout.write(self.style.ERROR(
                    f"Failed to send reminder {reminder.id} to {user_email}: {message}"
                ))
                error_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nFinished send_reminder_emails: sent={sent_count}, skipped={skipped_count}, errors={error_count}"
        ))
