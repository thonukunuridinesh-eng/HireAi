import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize basic standard HTTP applications protocols
django_asgi_app = get_asgi_application()

# Import the consumer class we will create in Step 4
from interview.consumers import InterviewConsumer

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    
    # WebSocket communication routing tree mapping hooks
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/interview/live/", InterviewConsumer.as_asgi()),
        ])
    ),
})
