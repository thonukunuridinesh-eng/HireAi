from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Resume
from .serializers import ResumeSerializer
from .tasks import process_resume_async  # Imported background task

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):
    """
    Saves file row and hands off processing workload to background workers instantly.
    """
    serializer = ResumeSerializer(data=request.data)

    if serializer.is_valid():
        resume_instance = serializer.save(user=request.user)
        
        # FIXED: Enqueues processing workload to background workers immediately
        # .delay() sends the job straight to Redis, returning execution control to React instantly
        process_resume_async.delay(resume_instance.id)

        return Response({
            'message': 'Resume received! HireAI has initialized background matrix evaluations.',
            'id': resume_instance.id,
            'file_name': resume_instance.file.name,
            'status': 'processing'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_resume_status(request, pk):
    """
    Returns the processing status, ATS score, and AI feedback for a given resume.
    """
    try:
        resume = Resume.objects.get(pk=pk, user=request.user)
        return Response({
            'id': resume.id,
            'ats_score': resume.ats_score,
            'ai_analysis': resume.ai_feedback
        }, status=status.HTTP_200_OK)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume record not found.'}, status=status.HTTP_404_NOT_FOUND)
