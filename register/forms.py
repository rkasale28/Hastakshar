from django import forms
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
	first_name = forms.CharField(max_length=25)
	last_name = forms.CharField(max_length=25)
	email = forms.EmailField()

	class Meta:
		model = User
		fields = ["first_name", "last_name","username", "email", "password1", "password2"] 
		
		#add fields here to display on registration form