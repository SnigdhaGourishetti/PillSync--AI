from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, UserSerializer
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
            "phone": self.user.phone,
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class AssignmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    CAREGIVER_MAX_PATIENTS = 3

    def get(self, request):
        user = request.user

        if user.role == User.Role.ADMIN:
            caregivers = User.objects.filter(role=User.Role.CAREGIVER).order_by("username")
            patients = User.objects.filter(role=User.Role.PATIENT).order_by("username")
            return Response({
                "caregivers": [
                    {
                        "id": caregiver.id,
                        "username": caregiver.username,
                        "email": caregiver.email,
                        "caregiver_shift": caregiver.caregiver_shift or "Morning",
                        "assigned_patients": User.objects.filter(role=User.Role.PATIENT, assigned_caregiver=caregiver).count(),
                    }
                    for caregiver in caregivers
                ],
                "patients": [
                    {
                        "id": patient.id,
                        "username": patient.username,
                        "email": patient.email,
                        "assigned_caregiver": patient.assigned_caregiver.id if patient.assigned_caregiver else None,
                        "assigned_caregiver_name": patient.assigned_caregiver.username if patient.assigned_caregiver else None,
                        "caregiver_shift": patient.caregiver_shift or "Morning",
                    }
                    for patient in patients
                ],
            })

        if user.role == User.Role.CAREGIVER:
            patients = User.objects.filter(role=User.Role.PATIENT, assigned_caregiver=user).order_by("username")
            return Response({
                "caregiver": {
                    "id": user.id,
                    "username": user.username,
                    "caregiver_shift": user.caregiver_shift or "Morning",
                    "assignment_count": patients.count(),
                },
                "patients": [
                    {
                        "id": patient.id,
                        "username": patient.username,
                        "caregiver_shift": patient.caregiver_shift or user.caregiver_shift or "Morning",
                        "email": patient.email,
                        "important_info": "Review med schedule and confirm refill needs.",
                      "task": "Medication check",
                      "next_step": "Verify today's dose and update notes."
                    }
                    for patient in patients
                ],
            })

        patient = user
        return Response({
            "patient": {
                "id": patient.id,
                "username": patient.username,
                "assigned_caregiver": patient.assigned_caregiver.id if patient.assigned_caregiver else None,
                "caregiver_shift": patient.caregiver_shift or "Morning",
            },
            "caregiver": {
                "id": patient.assigned_caregiver.id,
                "username": patient.assigned_caregiver.username,
                "caregiver_shift": patient.assigned_caregiver.caregiver_shift or "Morning",
            } if patient.assigned_caregiver else None,
        })

    def post(self, request):
        if request.user.role != User.Role.ADMIN:
            return Response({"detail": "Only admins can assign caregivers."}, status=status.HTTP_403_FORBIDDEN)

        patient_id = request.data.get("patient_id")
        caregiver_id = request.data.get("caregiver_id")
        caregiver_shift = request.data.get("caregiver_shift") or "Morning"

        if not patient_id or not caregiver_id:
            return Response({"detail": "patient_id and caregiver_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            patient = User.objects.get(pk=patient_id, role=User.Role.PATIENT)
            caregiver = User.objects.get(pk=caregiver_id, role=User.Role.CAREGIVER)
        except User.DoesNotExist:
            return Response({"detail": "Invalid patient or caregiver selection."}, status=status.HTTP_400_BAD_REQUEST)

        if patient.assigned_caregiver is not None:
            return Response({"detail": "This patient is already assigned."}, status=status.HTTP_400_BAD_REQUEST)

        assigned_count = User.objects.filter(role=User.Role.PATIENT, assigned_caregiver=caregiver).count()
        if assigned_count >= self.CAREGIVER_MAX_PATIENTS:
            return Response({"detail": f"Caregiver may only have {self.CAREGIVER_MAX_PATIENTS} patients."}, status=status.HTTP_400_BAD_REQUEST)

        patient.assigned_caregiver = caregiver
        patient.caregiver_shift = caregiver_shift
        patient.save()

        caregiver.caregiver_shift = caregiver_shift
        caregiver.save()

        return Response({
            "detail": "Patient assigned successfully.",
            "patient": patient.username,
            "caregiver": caregiver.username,
            "caregiver_shift": caregiver_shift,
        })