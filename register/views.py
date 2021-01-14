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
from django.conf import settings
from django.core.mail import send_mail

# Create your views here.
def register(request):
	form1 = UserForm()
	form2 = RegisterForm()
	return render(request, template_name="register/register.html", context={
		"register_form1":form1,
		"register_form2":form2,
		"from_mail" : settings.EMAIL_HOST_USER,
		"password": settings.EMAIL_HOST_PASSWORD
	})

def register_submit(request):
	try:		
		if (request.method=='POST'):
			fname = request.POST["first_name"]
			lname = request.POST["last_name"]
			email = request.POST["email"]
			uname = request.POST["username"]
			pwd1 = request.POST["password1"]
			pwd2 = request.POST["password2"]
			otp1 = request.POST["otp1"]
			otp2 = request.POST["otp2"]
			images = request.FILES['profile_picture'] if 'profile_picture' in request.FILES else 'profile_pics/default.jpg'
						
			if otp1 == otp2:
				user = hUser.objects.create_user(first_name=fname,last_name=lname,email=email,username=uname,password=pwd1)
				profile = User(user = user, profile_picture = images)
				profile.save()

				user = auth.authenticate(username=uname,password=pwd1)
				auth.login(request, user)				
				return redirect('/')			
			else:
				messages.warning(request, 'Incorrect OTP!')
				return redirect('/register')
	
	except IntegrityError as e:
		messages.warning(request, 'Username already exists in our system! Try a different username or login instead!') 
		return redirect('/register')


def login(request):
	login = LoginForm()
	return render(request, template_name="register/login.html", context={"login_form":login})

def login_submit(request):
	if (request.method=='POST'):
		uname = request.POST["username"]
		pwd = request.POST["password"]
		user = auth.authenticate(username=uname,password=pwd)
		if user is None:
			messages.warning(request, 'Invalid credentials!')
			return redirect('/login')
		else:
			userProfile = User.objects.get(user = user)
			auth.login(request, user)
			U = cookies.SimpleCookie()
			U['username'] = user
			# messages.success(request, 'You have successfully signed-in!')
			return redirect("/")
	else:
		return redirect('/login')


def logout(request):
	auth_logout(request)
	#messages.success(request, 'You have successfully logged out!')
	return redirect("/")

def home(request):
	return render(request, "main/home.html", {})

def email(request):
	return render(request, "register/mail.html",
	{
		"from_mail" : settings.EMAIL_HOST_USER,
		"to_mail" : 'dhairya.parekh@somaiya.edu',
		"subject" : 'Test Message',
		"message" : 'This is a test message',
		"password": settings.EMAIL_HOST_PASSWORD
	})
	# subject = 'Test Message'
	# message = 'This is a test message'
	# to_mail = ['dhairya.parekh@somaiya.edu']
	# from_mail = settings.EMAIL_HOST_USER
	# send_mail(subject, message, from_mail, to_mail, fail_silently=False)
	# return HttpResponse("Done")