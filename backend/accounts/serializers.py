from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "phone",
            "blood_group",
            "emergency_contact",
            "allergies",
            "date_of_birth",
            "assigned_caregiver",
            "caregiver_shift",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user

    def validate_role(self, value):
        if value == User.Role.ADMIN and User.objects.filter(role=User.Role.ADMIN).exists():
            raise serializers.ValidationError("Only one admin account is allowed.")
        return value


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone",
            "blood_group",
            "emergency_contact",
            "allergies",
            "date_of_birth",
            "assigned_caregiver",
            "caregiver_shift",
        ]