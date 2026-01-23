from background_task import background
from django.core.mail import send_mail
from django.conf import settings

@background(schedule=5)  # 5 seconds later
def send_otp_email(email, otp_code):
    subject = "Your OTP for Password Reset"
    message = f"Your OTP code is: {otp_code}\nIt is valid for 10 minutes."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
