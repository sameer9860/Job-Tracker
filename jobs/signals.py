from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import JobApplication, JobStatusHistory


@receiver(post_save, sender=JobApplication)
def create_initial_status(sender, instance, created, **kwargs):
    if created:
        JobStatusHistory.objects.create(
            job_application=instance,
            status=instance.status
        )


@receiver(pre_save, sender=JobApplication)
def track_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    previous = JobApplication.objects.get(pk=instance.pk)
    if previous.status != instance.status:
        JobStatusHistory.objects.create(
            job_application=instance,
            status=instance.status
        )
