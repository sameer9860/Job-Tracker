from django.contrib import admin

from accounts.models import PasswordResetOTP, UserProfile

# Register your models here.
admin.site.register(PasswordResetOTP)
admin.site.register(UserProfile)

