from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PasswordResetOTP, UserProfile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.decorators import login_required

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)


class SetNewPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password1 = serializers.CharField()
    new_password2 = serializers.CharField()

    def validate(self, attrs):
        if attrs["new_password1"] != attrs["new_password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        validate_password(data["password"])
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


# ✅ Move ProfileSerializer here, at top-level
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
            "full_name",
            "bio",
            "avatar",
        ]

    def get_avatar(self, obj):
        request = self.context.get("request")

        if obj.avatar:
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url

        # default avatar fallback
        default_path = "/media/avatars/default.png"
        if request:
            return request.build_absolute_uri(default_path)
        return default_path
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password1 = serializers.CharField(min_length=8, write_only=True)
    new_password2 = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs["new_password1"] != attrs["new_password2"]:
            raise serializers.ValidationError(
                {"new_password2": "Passwords do not match"}
            )
        return attrs