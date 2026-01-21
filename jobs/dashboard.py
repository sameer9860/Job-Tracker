from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import JobApplication


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user

    jobs = JobApplication.objects.filter(user=user)

    total_applications = jobs.count()

    status_counts = jobs.values('status').annotate(count=Count('id'))
    status_map = {item['status']: item['count'] for item in status_counts}

    applied = status_map.get('applied', 0)
    interview = status_map.get('interview', 0)
    offer = status_map.get('offer', 0)
    rejected = status_map.get('rejected', 0)

    interview_rate = (
        round((interview / total_applications) * 100, 2)
        if total_applications > 0 else 0
    )

    offer_rate = (
        round((offer / interview) * 100, 2)
        if interview > 0 else 0
    )

    company_progress = (
        jobs.values('company', 'status')
        .annotate(count=Count('id'))
        .order_by('company')
    )

    return Response({
        "total_applications": total_applications,
        "status_counts": {
            "applied": applied,
            "interview": interview,
            "offer": offer,
            "rejected": rejected,
        },
        "rates": {
            "interview_success_rate": interview_rate,
            "offer_conversion_rate": offer_rate,
        },
        "company_progress": company_progress,
    })
