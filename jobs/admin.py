from django.contrib import admin
from .models import JobApplication, JobStatusHistory, Reminder


class JobStatusHistoryInline(admin.TabularInline):
    model = JobStatusHistory
    extra = 0
    readonly_fields = ('status', 'changed_at')
    can_delete = False


class ReminderInline(admin.TabularInline):
    model = Reminder
    extra = 0


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'company',
        'role',
        'status',
        'user',
        'applied_date',
        'updated_at'
    )
    list_filter = ('status', 'source')
    search_fields = ('company', 'role', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [JobStatusHistoryInline, ReminderInline]


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('job_application', 'reminder_date', 'is_done')
    list_filter = ('is_done',)
    search_fields = ('job_application__company',)


@admin.register(JobStatusHistory)
class JobStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('job_application', 'status', 'changed_at')
    list_filter = ('status',)
