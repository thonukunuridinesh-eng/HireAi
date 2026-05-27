import os
from PyPDF2 import PdfReader
from google import genai

api_key = os.getenv('GEMINI_API_KEY')
if not api_key or len(api_key) < 10:
    api_key = "AIzaSyBJAnbolykTy_JH-JfIzJfW_aDZVzweESk"

client = genai.Client(api_key=api_key)

def extract_text_from_pdf(file_path):
    """
    Extracts raw text strings out of binary PDF document files page by page.
    """
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            extracted_page = page.extract_text()
            if extracted_page:
                text += extracted_page + "\n"
        return text.strip()
    except Exception:
        return ""

def calculate_ats_metrics(resume_text, target_skills=['python', 'react', 'django', 'sql']):
    """
    Extracts base keyword validation scores and handles Gemini 429 Rate Limits gracefully.
    """
    if not resume_text:
        return 0, "Validation Error: Could not extract readable characters from the document."

    # 1. Base Keyword Density Matcher Engine
    base_score = 0
    text_lower = resume_text.lower()
    for skill in target_skills:
        if skill in text_lower:
            base_score += 25

    # 2. AI Advanced Analytics Configuration Prompt
    prompt = (
        f"You are an elite Applicant Tracking System (ATS) auditor. Scan this resume text content "
        f"and evaluate its match against these required core skills: {', '.join(target_skills)}.\n\n"
        f"Resume Content:\n{resume_text}\n\n"
        f"Provide a concise, professional 3-sentence summary covering strengths and improvements."
    )

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        ai_feedback = response.text
    except Exception as e:
        # FIXED: Catching Google's 429 Quota Rate Limits and triggering the local backup fallback
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "503" in error_msg or "UNAVAILABLE" in error_msg:
            print("⚠️ [Gemini API Blocked] Rate limit (429) or high traffic (503) triggered. Running local analyzer...")
            
            found_skills = [skill.upper() for skill in target_skills if skill in text_lower]
            missing_skills = [skill.upper() for skill in target_skills if skill not in text_lower]
            
            ai_feedback = (
                f"Evaluation Completed (Local Fallback Engine Mode - Gemini Free Tier Quota Exceeded)\n\n"
                f"• Verified Key Competencies Found: {', '.join(found_skills) if found_skills else 'None'}\n"
                f"• Recommended Skills to Append: {', '.join(missing_skills) if missing_skills else 'None'}\n"
                f"• Summary: Your resume document contains core keyword sets. HireAI processed your file using your local system architecture because your daily Google cloud API quota has been met."
            )
        else:
            ai_feedback = f"AI processing error: {error_msg}"

    return base_score, ai_feedback
