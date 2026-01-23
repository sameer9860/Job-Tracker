from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
import random
from .serializers import RegisterSerializer
from django.contrib.auth.models import User

from .models import PasswordResetOTP
from .serializers import (
    PasswordResetRequestSerializer,
    OTPVerifySerializer,
    SetNewPasswordSerializer
)
from .tasks import send_otp_email


# 🔹 1. REQUEST PASSWORD RESET (SEND OTP)
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # generate 6-digit OTP
        otp_code = random.randint(100000, 999999)

        PasswordResetOTP.objects.create(
            user=user,
            otp_code=otp_code
        )

        # send email (celery / background task)
        send_otp_email(email, otp_code)

        return Response(
            {"detail": "OTP sent to email"},
            status=status.HTTP_200_OK
        )


# 🔹 2. VERIFY OTP
class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            otp = PasswordResetOTP.objects.filter(
                user=user,
                otp_code=otp_code,
                is_used=False
            ).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            return Response(
                {"detail": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not otp.is_valid():
            return Response(
                {"detail": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp.is_used = True
        otp.save()

        return Response(
            {"detail": "OTP verified successfully"},
            status=status.HTTP_200_OK
        )


# 🔹 3. SET NEW PASSWORD
class SetNewPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]
        new_password = serializer.validated_data["new_password1"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            PasswordResetOTP.objects.filter(
                user=user,
                otp_code=otp_code,
                is_used=True
            ).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            return Response(
                {"detail": "OTP not verified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password changed successfully"},
            status=status.HTTP_200_OK
        )

class RegisterView(APIView):
    permission_classes = [AllowAny]  # 🔥 THIS LINE FIXES 401

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return Response(
            {"detail": "Registration successful"},
            status=status.HTTP_201_CREATED
        )