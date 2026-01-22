# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import OTP
from .serializers import PasswordResetEmailSerializer, OTPVerifySerializer, PasswordResetSerializer
import random
from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, code):
    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP is: {code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        code = str(random.randint(100000, 999999))
        OTP.objects.create(user=user, code=code)
        send_otp_email(email, code)
        return Response({"detail": "OTP sent to email."})

class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']
        password = serializer.validated_data['password1']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email."}, status=status.HTTP_400_BAD_REQUEST)

        otp_qs = OTP.objects.filter(user=user, code=otp_code).order_by('-created_at')
        if not otp_qs.exists() or not otp_qs.first().is_valid():
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        otp_qs.delete()  # optional: remove OTP after use

        return Response({"detail": "Password reset successful."})
