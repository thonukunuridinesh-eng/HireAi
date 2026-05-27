from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # Ensure these two lines exist so database validation doesn't throw a 400 Bad Request
    ats_score = models.IntegerField(null=True, blank=True)
    ai_feedback = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Resume ({self.uploaded_at.strftime('%Y-%m-%d')})"

