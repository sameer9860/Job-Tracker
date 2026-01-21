from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobApplicationViewSet, ReminderViewSet
from .dashboard import dashboard_stats

router = DefaultRouter()
router.register('jobs', JobApplicationViewSet, basename='jobs')
router.register('reminders', ReminderViewSet, basename='reminders')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
]
