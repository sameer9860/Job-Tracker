from django.urls import path
from .views import PasswordResetRequestView, OTPVerifyView, SetNewPasswordView

urlpatterns = [
    path("password-reset-request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("otp-verify/", OTPVerifyView.as_view(), name="otp-verify"),
    path("set-new-password/", SetNewPasswordView.as_view(), name="set-new-password"),
]
