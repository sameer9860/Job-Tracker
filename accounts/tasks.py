from background_task import background
from django.core.mail import send_mail
from django.contrib.auth.models import User

@background(schedule=5)
def send_otp_email(user_id, otp_code):
    user = User.objects.get(id=user_id)
    send_mail(
        subject="Your OTP Code",
        message=f"Hello {user.username}, your OTP code is: {otp_code}",
        from_email="no-reply@example.com",
        recipient_list=[user.email],
    )
