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
from . import ajax_validation as ajax

urlpatterns = [
    path('register/', views.register, name = "register"),
    path('login/', views.login, name = "login"),
    path("logout/", views.logout, name= "logout"),
    path('register_submit',views.register_submit,name="register_submit"),
    path('login_submit',views.login_submit,name="login_submit"),
    path('', views.home, name="home"),
    path('email/',views.email,name="email"),
    path('forgot_password/',views.forgot_password,name="forgot_password"),
    path('forgot_submit',views.forgot_submit,name="forgot_submit"),
    path('view_profile/',views.view_profile,name="view_profile"),

    path('ajax/validate_email/', ajax.validate_email, name='validate_email'),
    path('ajax/validate_username/', ajax.validate_username, name='validate_username'),
    path('ajax/validate_password/', ajax.validate_password, name='validate_password'),
    path('ajax/validate_username_exists/', ajax.validate_username_exists, name='validate_username_exists'),
    path('ajax/get_email/', ajax.get_email, name='get_email'),
    path('ajax/get_data/', ajax.get_data, name='get_data'),
]