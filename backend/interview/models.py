from django.db import models
from django.contrib.auth.models import User

class VoiceResponse(models.Model):
    # Links the stored voice answer directly to the logged-in user profile
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voice_responses')
    question = models.TextField()
    answer = models.TextField()
    evaluation = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Voice Answer ({self.created_at.strftime('%Y-%m-%d')})"
class BotChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bot_chats')
    user_message = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Bot Chat ({self.timestamp.strftime('%H:%M')})"
