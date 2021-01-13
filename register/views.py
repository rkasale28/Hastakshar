from .forms import RegisterForm, UserForm, LoginForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse
from django.contrib.auth.models import User as hUser, auth
from .models import User
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from http import cookies

# Create your views here.
def register(request):
	form1 = UserForm()
	form2 = RegisterForm()
	return render(request, template_name="register/register.html", context={"register_form1":form1,"register_form2":form2})

def register_submit(request):
	try:		
		if (request.method=='POST'):
			fname = request.POST["first_name"]
			lname = request.POST["last_name"]
			email = request.POST["email"]
			uname = request.POST["username"]
			pwd1 = request.POST["password1"]
			pwd2 = request.POST["password2"]
			images = request.FILES['profile_picture'] if 'profile_picture' in request.FILES else 'profile_pics/default.jpg'
			if pwd1 == pwd2:
				user = hUser.objects.create_user(first_name=fname,last_name=lname,email=email,username=uname,password=pwd1)
				profile = User(user = user, profile_picture = images)
				profile.save()
				# If registration done directly redirect to home with login
				# user = auth.authenticate(username=uname,password=pwd1)
				# auth.login(request,user)
				
				return HttpResponse("Done")
			
			else:
				return HttpResponse("Password don't match")
	
	except IntegrityError as e:
		#messages.danger(request, "Usename already exists!") 
		return HttpResponse(e)


def login(request):
	login = LoginForm()
	return render(request, template_name="register/login.html", context={"login_form":login})

def login_submit(request):
	if (request.method=='POST'):
		uname = request.POST["username"]
		pwd = request.POST["password"]
		user = auth.authenticate(username=uname,password=pwd)
		print('authenticates')
		if user is None:
			print("Invalid Cred")
			return HttpResponse("Invalid creds")
		else:
			print("else")
			userProfile = User.objects.get(user = user)
			auth.login(request, user)
			print("login")
			U = cookies.SimpleCookie()
			U['username'] = user
			print("Login success")
			return redirect("/home")
	else:
		return HttpResponse("Get")


def logout(request):
	auth_logout(request)
	#messages.info(request, "You have successfully logged out.") 
	return redirect("/home")

def home(request):
	return render(request, "main/home.html", {})