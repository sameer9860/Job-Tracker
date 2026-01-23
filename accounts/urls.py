from django.urls import path
from .views import PasswordResetRequestView, OTPVerifyView, SetNewPasswordView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("password-reset-request/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("otp-verify/", OTPVerifyView.as_view(), name="otp_verify"),
    path("set-new-password/", SetNewPasswordView.as_view(), name="set_new_password"),
]
