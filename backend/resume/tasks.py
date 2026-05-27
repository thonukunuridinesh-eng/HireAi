from celery import shared_task
from .models import Resume
from .utils import extract_text_from_pdf, calculate_ats_metrics

@shared_task
def process_resume_async(resume_id):
    """
    Background worker process to parse PDF text and query Gemini asynchronously.
    """
    print(f"🚀 [Celery Worker] Beginning background analysis for Resume ID: {resume_id}")
    
    try:
        resume_instance = Resume.objects.get(id=resume_id)
        file_path = resume_instance.file.path
        
        # 1. Run slow PDF extraction
        extracted_text = extract_text_from_pdf(file_path)
        
        # 2. Query Gemini AI matrix
        ats_score, ai_feedback = calculate_ats_metrics(extracted_text)
        
        # 3. Save calculations back to database columns securely
        resume_instance.ats_score = ats_score
        resume_instance.ai_feedback = ai_feedback
        resume_instance.save()
        
        print(f"✅ [Celery Worker] Finished background analysis successfully for Resume ID: {resume_id}")
        return f"Resume {resume_id} processed cleanly."
    except Resume.DoesNotExist:
        print(f"❌ [Celery Worker] Resume ID {resume_id} not found.")
    except Exception as e:
        print(f"❌ [Celery Worker] Critical pipeline failure: {str(e)}")
