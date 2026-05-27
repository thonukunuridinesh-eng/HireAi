from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    # Redirects the blank root URL (/) straight to your SimpleJWT login endpoint
    path('', RedirectView.as_view(url='api/auth/login/', permanent=False), name='root_redirect'),  
    
    # Core Admin Dashboard
    path('admin/', admin.site.urls),
    
    # App API Endpoints
    path('api/auth/', include('authentication.urls')),
    path('api/interview/', include('interview.urls')),
    path('api/resume/', include('resume.urls')),# Added for STEP 28
]

# Serves user-uploaded files (like Resumes) during local development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

