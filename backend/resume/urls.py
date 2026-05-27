from django.urls import path
from .views import upload_resume, check_resume_status

urlpatterns = [
    path('upload/', upload_resume, name='upload_resume'),
    path('status/<int:pk>/', check_resume_status, name='check_resume_status'), # Added tracking path
]
