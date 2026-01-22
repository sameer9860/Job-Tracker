from rest_framework import serializers
from django.contrib.auth.models import User
from .models import OTP

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

class SetNewPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password1 = serializers.CharField(min_length=6)
    new_password2 = serializers.CharField(min_length=6)

    def validate(self, data):
        if data["new_password1"] != data["new_password2"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data
