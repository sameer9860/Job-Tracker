from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import PasswordResetOTP
from .serializers import PasswordResetRequestSerializer, OTPVerifySerializer, SetNewPasswordSerializer
from .tasks import send_otp_email
import random

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        otp_code = f"{random.randint(100000, 999999)}"
        PasswordResetOTP.objects.create(user=user, otp_code=otp_code)
        send_otp_email(email, otp_code)  # background task
        return Response({"detail": "OTP sent to your email"})


class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = PasswordResetOTP.objects.filter(user=user, otp_code=otp_code, is_used=False).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if not otp.is_valid():
            return Response({"detail": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()
        return Response({"detail": "OTP verified"})


class SetNewPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]
        new_password = serializer.validated_data["new_password1"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = PasswordResetOTP.objects.filter(user=user, otp_code=otp_code, is_used=True).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            return Response({"detail": "OTP not verified"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password changed successfully"})
