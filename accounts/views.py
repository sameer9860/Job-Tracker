from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import OTP
from .serializers import PasswordResetRequestSerializer, OTPVerifySerializer, SetNewPasswordSerializer
import random
from .tasks import send_otp_email
from django.utils import timezone

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=404)

        otp_code = str(random.randint(100000, 999999))
        OTP.objects.create(user=user, code=otp_code)

        send_otp_email(user.id, otp_code)  # background task
        return Response({"detail": "OTP sent to your email"})

class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=404)

        otp = OTP.objects.filter(user=user, code=otp_code, is_used=False, expires_at__gte=timezone.now()).first()
        if not otp:
            return Response({"detail": "Invalid or expired OTP"}, status=400)

        otp.is_used = True
        otp.save()
        return Response({"detail": "OTP verified"})

class SetNewPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]
        password = serializer.validated_data["new_password1"]

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=404)

        otp = OTP.objects.filter(user=user, code=otp_code, is_used=True).first()
        if not otp:
            return Response({"detail": "OTP not verified or invalid"}, status=400)

        user.set_password(password)
        user.save()
        return Response({"detail": "Password changed successfully"})
