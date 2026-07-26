from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import MedicationHistory
from .serializers import MedicationHistorySerializer


class MedicationHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status']
    search_fields = ['medicine__medicine_name']

    def get_queryset(self):
        return MedicationHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
