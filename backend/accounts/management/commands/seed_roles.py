from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Seed a single admin account plus sample caregiver and patient accounts"

    def handle(self, *args, **options):
        User = get_user_model()

        if not User.objects.filter(role=User.Role.ADMIN).exists():
            User.objects.create_user(
                username="admin",
                email="admin@pillsync.com",
                password="admin123",
                role=User.Role.ADMIN,
                phone="1234567890",
            )
            self.stdout.write(self.style.SUCCESS("Created admin account"))
        else:
            self.stdout.write("Admin account already exists")

        caregiver_names = [
            ("caregiver1", "caregiver1@pillsync.com", "Morning"),
            ("caregiver2", "caregiver2@pillsync.com", "Evening"),
        ]
        for username, email, shift in caregiver_names:
            user = User.objects.filter(username=username).first()
            if not user:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password="caregiver123",
                    role=User.Role.CAREGIVER,
                    phone="1111111111",
                    caregiver_shift=shift,
                )
                self.stdout.write(self.style.SUCCESS(f"Created caregiver {username}"))
            else:
                user.caregiver_shift = shift
                user.save()

        patient_names = [
            ("patient1", "patient1@pillsync.com", "Morning"),
            ("patient2", "patient2@pillsync.com", "Evening"),
        ]
        for username, email, shift in patient_names:
            user = User.objects.filter(username=username).first()
            if not user:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password="patient123",
                    role=User.Role.PATIENT,
                    phone="2222222222",
                    caregiver_shift=shift,
                )
                self.stdout.write(self.style.SUCCESS(f"Created patient {username}"))
            else:
                user.caregiver_shift = shift
                user.save()
