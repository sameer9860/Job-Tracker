from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import PasswordResetOTP
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.core.mail import send_mail
import random

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate OTP
        otp = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(user=user, otp=otp)

        # Send email using MailHog
        send_mail(
            subject="Your OTP for Password Reset",
            message=f"Your OTP is {otp}. It expires in 10 minutes.",
            from_email="no-reply@jobtracker.com",
            recipient_list=[email],
        )

        return Response({"detail": "OTP sent to email"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password1']

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        otp_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).first()
        if not otp_obj or not otp_obj.is_valid():
            return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        otp_obj.is_used = True
        otp_obj.save()

        return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)
