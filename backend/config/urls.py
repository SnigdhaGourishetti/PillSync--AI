from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/accounts/", include("accounts.urls")),
    path("api/medicines/", include("medicines.urls")),
    path("api/reminders/", include("reminders.urls")),
    path("api/prescriptions/", include("prescriptions.urls")),
    path("api/medication-history/", include("medication_history.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)