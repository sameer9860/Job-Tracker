from rest_framework import serializers
from .models import JobApplication, JobStatusHistory, Reminder


class JobStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStatusHistory
        fields = ['status', 'changed_at']


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
        read_only_fields = ['job_application']


class JobApplicationSerializer(serializers.ModelSerializer):
    status_history = JobStatusHistorySerializer(many=True, read_only=True)
    reminders = ReminderSerializer(many=True, read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']
