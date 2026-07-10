from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


class User(AbstractUser):

    class Role(models.TextChoices):
        PATIENT = "PATIENT", "Patient"
        CAREGIVER = "CAREGIVER", "Caregiver"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PATIENT
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    blood_group = models.CharField(
        max_length=5,
        blank=True,
        null=True
    )

    emergency_contact = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    allergies = models.TextField(
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    assigned_caregiver = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_patients",
    )

    caregiver_shift = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        help_text="Time slot for the caregiver, e.g. Morning or Evening",
    )

    def clean(self):
        super().clean()
        if self.role == self.Role.ADMIN:
            existing_admins = User.objects.exclude(pk=self.pk).filter(role=self.Role.ADMIN)
            if existing_admins.exists():
                raise ValidationError({"role": "Only one admin account is allowed."})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.username 