from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register, request_otp, verify_otp

urlpatterns = [
    # Maps registration view endpoint
    path('register/', register, name='auth_register'),
    
    # Maps simple JWT token obtain and login refresh pairs endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Maps new Email OTP modules views paths
    path('request-otp/', request_otp, name='request_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
]
