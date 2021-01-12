from .forms import RegisterForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm 

# Create your views here.
def register(response):
	if response.method == "POST":
		form = RegisterForm(response.POST)
		if form.is_valid():
			form.save()
			#messages.success(response, "Registration successful." )
			return redirect("/login")
		#messages.error(response, "Unsuccessful registration. Invalid information.")
	else:
		form = RegisterForm()
		
	return render(response, template_name="register/register.html", context={"register_form":form})

def login(response):
	if response.method == "POST":
		form = AuthenticationForm(response, data=response.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			user = authenticate(username=username, password=password)
			if user is not None:
				auth_login(response, user)
				# messages.info(response, f"You are now logged in as {username}.")
				return redirect("/home")
			# else:
			# 	messages.error(response,"Invalid username or password.")
		# else:
		# 	messages.error(response,"Invalid username or password.")
	form = AuthenticationForm()
	return render(response, template_name="register/login.html", context={"login_form":form})

def logout(response):
	auth_logout(response)
	#messages.info(response, "You have successfully logged out.") 
	return redirect("/home")