from django.urls import path
from .views import CustomTokenObtainPairView, RegisterView, ProfileView, AssignmentView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    path(
        "assignments/",
        AssignmentView.as_view(),
        name="assignments",
    ),
]