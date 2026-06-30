from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

from .models import JobApplication, Reminder


@receiver(post_save, sender=JobApplication)
def create_interview_reminder(sender, instance, created, **kwargs):
    # Only trigger when status is interview
    if instance.status != "interview":
        return

    # Prevent duplicate reminders
    if instance.reminders.exists():
        return

    # If interview date exists, remind 1 day before
    if instance.interview_date:
        reminder_time = instance.interview_date - timedelta(days=1)
    else:
        # fallback reminder
        reminder_time = timezone.now() + timedelta(days=2)

    Reminder.objects.create(
        job_application=instance,
        reminder_date=reminder_time,
        message="Prepare for interview and follow up with recruiter."
    )
