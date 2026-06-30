from django.urls import path
from .views import ChangePasswordView, PasswordResetRequestView, OTPVerifyView, ProfileView, SetNewPasswordView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("password-reset-request/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("otp-verify/", OTPVerifyView.as_view(), name="otp_verify"),
    path("set-new-password/", SetNewPasswordView.as_view(), name="set_new_password"),
    path("profile/", ProfileView.as_view()),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),


]
