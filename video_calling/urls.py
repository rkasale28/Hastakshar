from django.conf.urls import url

from . import views

urlpatterns = [
    url('index', views.index, name='index'),
    url('user-preferences', views.user_preferences, name='user-preferences')
]