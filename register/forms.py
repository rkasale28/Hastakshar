from django import forms
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import UserProfiles

class RegisterForm(forms.ModelForm):
	first_name = forms.CharField(max_length=25)
	last_name = forms.CharField(max_length=25)
	email = forms.EmailField()

	class Meta:
		model = UserProfiles
		fields = ["username", "first_name", "last_name", "email", "password1", "password2"] 
		
		#add fields here to display on registration form


# from django import forms
# from django.contrib.auth import login, authenticate
# from django.contrib.auth.forms import UserCreationForm, UserChangeForm
# from django.contrib.auth.models import User

# class RegisterForm(UserCreationForm):
	
# 	username = forms.CharField(max_length=25)    
# 	first_name = forms.CharField(max_length=25)    
# 	last_name = forms.CharField(max_length=25)    
# 	email = forms.EmailField(max_length=100)    
# 	# profile_picture = forms.ImageField(upload_to='profile_pics', blank=True)    
# 	password1 = forms.CharField(max_length=25)    
# 	password2 = forms.CharField(max_length=25)

# 	class Meta:
# 		model = User
# 		fields = ["username", "first_name", "last_name", "email", "password1", "password2"] 
		
# 		#add fields here to display on registration form