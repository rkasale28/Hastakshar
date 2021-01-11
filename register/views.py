from .forms import RegisterForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate
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

def login(request):
	if request.method == "POST":
		form = AuthenticationForm(request, data=request.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			user = authenticate(username=username, password=password)
			if user is not None:
				auth_login(request, user)
				# messages.info(request, f"You are now logged in as {username}.")
				return redirect("/home")
			# else:
			# 	messages.error(request,"Invalid username or password.")
		# else:
		# 	messages.error(request,"Invalid username or password.")
	form = AuthenticationForm()
	return render(request, template_name="register/login.html", context={"login_form":form})
