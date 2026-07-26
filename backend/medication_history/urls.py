from rest_framework.routers import DefaultRouter
from .views import MedicationHistoryViewSet

router = DefaultRouter()
router.register("", MedicationHistoryViewSet, basename="medication_history")

urlpatterns = router.urls
