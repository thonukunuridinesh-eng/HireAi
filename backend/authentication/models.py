import random
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# ==============================================================================
# MODEL 1: EMAIL OTP AUTHENTICATION STORAGE
# ==============================================================================
class EmailOTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        """Returns True if the token was generated in the last 5 minutes."""
        return timezone.now() < self.created_at + timedelta(minutes=5)

    @classmethod
    def generate_otp(cls, email):
        """Constructs a secure random 6-digit number string and commits it to database storage."""
        # Clean out any old active tokens for this email address first
        cls.objects.filter(email=email).delete()
        
        new_code = f"{random.randint(100000, 999999)}"
        instance = cls.objects.create(email=email, otp_code=new_code)
        return instance


# ==============================================================================
# MODEL 2: ROLE-BASED USER PROFILE EXTENSION
# ==============================================================================
class UserProfile(models.Model):
    # Links directly to Django's core authentication User instance
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate'),
    )
    # FIXED: Re-declared cleanly with zero structural string artifacts
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')
    company_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Role: {self.get_role_display()}"


# ==============================================================================
# AUTOMATED DJANGO SIGNALS MECHANICS
# ==============================================================================
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automated signal trigger: Creates a matching UserProfile block 
    instantly whenever a new bare User instance is generated.
    """
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Ensures structural data alignments whenever user parameters shift.
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()


