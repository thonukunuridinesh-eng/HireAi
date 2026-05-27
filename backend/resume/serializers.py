from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        # Explicitly declare fields so fields updated by PyPDF2/Gemini don't cause validation crashes
        fields = ['id', 'user', 'file', 'uploaded_at', 'ats_score', 'ai_feedback']
        read_only_fields = ['user', 'uploaded_at', 'ats_score', 'ai_feedback'] # Frontend only sends the file!
