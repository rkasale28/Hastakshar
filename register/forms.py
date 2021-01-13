from django import forms
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User
from django.contrib.auth.models import User as hUser

class UserForm(forms.Form):
    
    first_name = forms.CharField(max_length=25, label='First Name', required=True)
    last_name = forms.CharField(max_length=25, label='Last Name', required=True)
    username = forms.CharField(max_length=25, label='Username', required=True)
    email = forms.EmailField(max_length=50, label='Email Address', required=True)
    password1 = forms.CharField(max_length=25, label='Password', required=True, widget=forms.PasswordInput())
    password2 = forms.CharField(max_length=25, label='Confirm Password', required=True, widget=forms.PasswordInput())

class RegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields=['profile_picture']