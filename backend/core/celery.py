import os
from celery import Celery

# Set default Django settings module environment variable layout
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Celery app instance hook
app = Celery('core')

# Read task configurations namespace properties out of settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Automatically scan all tracking apps (like resume, interview) for a tasks.py file
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request parameters tracing: {self.request!r}')
