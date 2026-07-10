from django.contrib.auth import get_user_model
from django.test import TestCase

from .serializers import RegisterSerializer


class AdminLimitTests(TestCase):
    def test_only_one_admin_can_be_created(self):
        User = get_user_model()
        User.objects.create_user(
            username="admin-main",
            email="admin@example.com",
            password="securepass123",
            role=User.Role.ADMIN,
        )

        serializer = RegisterSerializer(
            data={
                "username": "admin-second",
                "email": "admin2@example.com",
                "password": "securepass123",
                "role": User.Role.ADMIN,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("role", serializer.errors)
