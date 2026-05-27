from django.urls import path

from .views import (
    generate_interview,
    evaluate_audio_answer,
    deep_evaluate_text_answer,
    execute_code_proxy,
    hireai_bot_chat,
    get_user_analytics
)

urlpatterns = [

    path('generate/', generate_interview),

    path('voice-evaluate/', evaluate_audio_answer),

    path('text-evaluate/', deep_evaluate_text_answer),

    path('execute/', execute_code_proxy),

    path('chat/', hireai_bot_chat),

    path('analytics/', get_user_analytics),
]