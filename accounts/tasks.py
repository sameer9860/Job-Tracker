from background_task import background
from django.core.mail import send_mail
from django.conf import settings


@background(schedule=1)
def send_otp_email(email, otp_code):
    send_mail(
        subject="Your Password Reset OTP",
        message=f"Your OTP code is {otp_code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
