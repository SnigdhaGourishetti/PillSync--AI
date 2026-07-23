from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from reminders.models import Reminder
from utils.email_utils import send_end_of_day_pending_email
from django.conf import settings


User = get_user_model()


class Command(BaseCommand):
    help = 'Send end-of-day pending medication emails to users with pending reminders'

    def handle(self, *args, **options):
        now = timezone.now()
        current_time = now.time()

        self.stdout.write(f"Running end-of-day pending medication check at {current_time}")

        users_to_notify = User.objects.filter(
            reminders__status='PENDING',
            reminders__is_active=True,
        ).distinct().exclude(email='')

        if not users_to_notify.exists():
            self.stdout.write("No users with pending reminders found at this time")
            return

        base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')

        self.stdout.write(f"Found {users_to_notify.count()} users with pending reminders")

        for user in users_to_notify:
            pending_reminders = Reminder.objects.filter(
                user=user,
                status='PENDING',
                is_active=True,
            ).select_related('medicine')

            reminder_list = [
                {
                    'medicine_name': reminder.medicine.medicine_name,
                    'reminder_time': reminder.reminder_time.strftime("%I:%M %p"),
                    'id': reminder.id,
                }
                for reminder in pending_reminders
            ]

            success, result = send_end_of_day_pending_email(
                user_email=user.email,
                user_name=user.username,
                user_id=user.id,
                pending_reminders=reminder_list,
                base_url=base_url,
            )

            if success:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Sent end-of-day pending email to {user.email}: {result}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(
                        f"Failed to send end-of-day pending email to {user.email}: {result}"
                    )
                )

        self.stdout.write("End-of-day pending medication check completed")
