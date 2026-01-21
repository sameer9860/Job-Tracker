from rest_framework import viewsets, permissions
from .models import JobApplication, Reminder
from .serializers import JobApplicationSerializer, ReminderSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(
            job_application__user=self.request.user
        )

    def perform_create(self, serializer):
        job_id = self.request.data.get('job_application')
        serializer.save(job_application_id=job_id)
