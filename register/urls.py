"""miniproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('register/', views.register, name = "register"),
    path('login/', views.login, name = "login"),
    path("logout/", views.logout, name= "logout"),
    path('register_submit',views.register_submit,name="register_submit"),
    path('login_submit',views.login_submit,name="login_submit"),
    path('', views.home, name="home"),
    path('email/',views.email,name="email"),
    path('validate_username/', views.validate_username, name='validate_username'),
]