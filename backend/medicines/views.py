from rest_framework import viewsets, permissions
from .models import Medicine
from .serializers import MedicineSerializer


class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medicine.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        # Reset low_stock_email_sent flag when stock_quantity is updated
        if 'stock_quantity' in serializer.validated_data:
            instance.low_stock_email_sent = False
            instance.save()