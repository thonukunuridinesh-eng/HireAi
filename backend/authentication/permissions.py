from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    """
    Allows system endpoint entry clearance access ONLY to verified corporate recruiters.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'recruiter'
        )

class IsCandidate(BasePermission):
    """
    Allows system access clear entry points ONLY to candidate users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'candidate'
        )
