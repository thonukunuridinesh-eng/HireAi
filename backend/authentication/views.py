from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer
from .models import EmailOTP

# ==============================================================================
# VIEW 1: USER REGISTRATION SIGNUP (UPDATED WITH STRUCTURAL USER ROLES)
# ==============================================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Creates a new user profile inside the PostgreSQL database and assigns an operational role.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        # Save the primary User instance model layer
        user_instance = serializer.save()
        
        # Capture incoming custom role layout parameter (Defaults to candidate)
        submitted_role = request.data.get('role', 'candidate').lower().strip()
        
        if submitted_role in ['admin', 'recruiter', 'candidate']:
            # The user profile is auto-created by signals; we just map properties directly
            user_instance.profile.role = submitted_role
            
            # If the user is a recruiter, handle optional target company parameters mappings
            if submitted_role == 'recruiter':
                user_instance.profile.company_name = request.data.get('company_name', '').strip()
                
            user_instance.profile.save()

        return Response(
            {'message': f'User profile successfully registered inside PostgreSQL as a {submitted_role}!'}, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# VIEW 2: REQUEST 6-DIGIT EMAIL OTP 
# ==============================================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def request_otp(request):
    """
    Generates a fresh 6-digit verification code and prints it directly to the terminal.
    """
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'error': 'Email address field input is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate and save code to database
    otp_record = EmailOTP.generate_otp(email)

    # Stream sent email output cleanly over your local terminal console buffer
    subject = "Verify your HireAI Identity Profile Account"
    message = f"Your secure 6-digit registration passcode token is: {otp_record.otp_code}\nThis code expires in 5 minutes."
    
    try:
        send_mail(subject, message, 'verify@hireai.com', [email])
        return Response({'message': 'OTP successfully emitted! Check your Django server command terminal screen logs.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f"Failed to send email stream natively: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================================================
# VIEW 3: VERIFY EMAIL OTP
# ==============================================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Validates user submitted code token against active database parameters records.
    """
    email = request.data.get('email', '').strip()
    code = request.data.get('otp', '').strip()

    if not email or not code:
        return Response({'error': 'Both tracking fields parameter arrays are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        record = EmailOTP.objects.get(email=email, otp_code=code)
        
        if not record.is_valid():
            return Response({'error': 'Validation Failure: Code token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        
        record.is_verified = True
        record.save()
        return Response({'message': 'OTP verification verified successfully! Profile registration pipeline unlocked.'}, status=status.HTTP_200_OK)
    
    except EmailOTP.DoesNotExist:
        return Response({'error': 'Validation Failure: Invalid email address or token passcode input mismatch.'}, status=status.HTTP_400_BAD_REQUEST)
