"""
WSGI config for miniproject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
import socketio

from video_calling.views import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'miniproject.settings')

django_app = get_wsgi_application()
application = socketio.WSGIApp(sio, django_app)