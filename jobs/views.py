from rest_framework import viewsets, permissions
from .models import JobApplication, Reminder
from .serializers import JobApplicationSerializer, ReminderSerializer
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import JobApplication
from .serializers import JobApplicationSerializer
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


 
    # 🔹 Custom endpoint: PATCH /jobs/{id}/update_status/
     # 🔹 Custom endpoint: PATCH /jobs/{id}/update_status/@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_job_status(request, pk):
    try:
        job = JobApplication.objects.get(pk=pk, user=request.user)
    except JobApplication.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    status = request.data.get("status")
    if status not in [choice[0] for choice in JobApplication.STATUS_CHOICES]:
        return Response({"error": "Invalid status"}, status=400)

    job.status = status
    job.save()

    # Optional: return updated job
    serializer = JobApplicationSerializer(job)
    return Response(serializer.data)