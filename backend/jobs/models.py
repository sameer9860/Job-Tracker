from django.db import models
from django.contrib.auth.models import User


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_applications' 
    )

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='applied'
    )

    applied_date = models.DateField(auto_now_add=True)

    interview_date = models.DateTimeField(null=True, blank=True)
    interview_location = models.CharField(max_length=255, blank=True)

    offer_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    offer_date = models.DateField(null=True, blank=True)

    source = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.company} - {self.role}"


class JobStatusHistory(models.Model):
    job_application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="status_history"
    )
    status = models.CharField(
        max_length=20,
        choices=JobApplication.STATUS_CHOICES
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-changed_at']

    def __str__(self):
        return f"{self.job_application.company} → {self.status}"


class Reminder(models.Model):
    job_application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="reminders"
    )
    reminder_date = models.DateTimeField()
    message = models.CharField(max_length=255)
    is_done = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['reminder_date']

    def __str__(self):
        return f"Reminder: {self.job_application.company}"
