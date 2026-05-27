import os
from google import genai
from django.conf import settings

# 1. Define your fresh, valid API key directly as a clean string constant
HARDCODED_KEY = "AIzaSyBjztjYCFLYoYNV0EjUEggiwkKwM16PqMw"

# 2. Try to get it from the environment; if it's missing or broken, force our clean string
api_key = os.getenv('GEMINI_API_KEY')
if not api_key or len(api_key) < 10:
    api_key = HARDCODED_KEY

# CRITICAL FIX: Pass the api_key variable explicitly inside genai.Client()
# This forces the Google SDK to use our string instead of looking at broken system variables!
client = genai.Client(api_key=api_key)

def generate_questions(skill):
    """
    Generates 10 targeted interview questions using the standard gemini-2.5-flash model architecture.
    """
    prompt = f"Generate 10 highly relevant technical interview questions for a candidate specializing in: {skill}. Return only the plain questions text."
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error interacting with modern Gemini Engine: {str(e)}"
