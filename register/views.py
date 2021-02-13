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
import re
from urllib.parse import urlencode
from django.utils.crypto import get_random_string
# from django.contrib.auth.decorators import login_required

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
			images = request.FILES['profile_picture'] if 'profile_picture' in request.FILES else 'profile_pics/default.jpg'
			unique_id = get_random_string(length = 32)
						
			user = hUser.objects.create_user(first_name=fname,last_name=lname,email=email,username=uname,password=pwd1)
			profile = User(user = user, profile_picture = images, secondary_id = unique_id)
			profile.save()

			user = auth.authenticate(username=uname,password=pwd1)
			auth.login(request, user)				
			return redirect('/')			
	except IntegrityError as e:
		messages.warning(request, 'Username already exists in our system! Try a different username or login instead!') 
		return redirect('/register')

def login(request):
	next = request.GET.get('next')
	roomId = request.GET.get('roomId')
	login = LoginForm()
	return render(request, template_name="register/login.html", context={"login_form":login,"next":next,"roomId":roomId})

def login_submit(request):
	if (request.method=='POST'):
		uname = request.POST["username"]
		pwd = request.POST["password"]
		next = request.POST["next"]
		roomId = request.POST["roomId"]
		url = request.POST["url"]
		
		user = auth.authenticate(username=uname,password=pwd)
		if user is None:
			messages.warning(request, 'Invalid credentials!')
			return redirect(url)
		else:
			userProfile = User.objects.get(user = user)
			auth.login(request, user)
			U = cookies.SimpleCookie()
			U['username'] = user
			# messages.success(request, 'You have successfully signed-in!')
			if (next == "None"):
				return redirect("/")
			else:
				if (roomId == "None"):
					return redirect(next)
				else:
					base_url = next
					query_string =  urlencode({'roomId': roomId})
					url = '{}?{}'.format(base_url,query_string)   
					return redirect(url) 
	else:
		return redirect('/login')

def forgot_password(request):
	return render(request,'register/forgot.html')

def forgot_submit(request):
	if (request.method=='POST'):
		username = request.POST["username"]
		pwd = request.POST["password1"]

		user = hUser.objects.get(username=username)
		user.set_password(pwd)
		user.save()
		messages.success(request, 'Password reset successfully')
		return redirect('/login')
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

def view_profile(request):	
	return render(request,'main/view_profile.html')

def update_profile_pic_submit(request):
	if request.method == 'POST':
		initial_profile_pic=request.user.user.profile_picture.url
		initial_profile_pic=initial_profile_pic.replace('/media/', '')
		profile_pic=request.FILES['profile_picture'] if 'profile_picture' in request.FILES else initial_profile_pic
		
		profile = User.objects.get(user=request.user)
		profile.profile_picture=profile_pic
		profile.save()
		return redirect('/view_profile')
	else:
		return redirect('/view_profile')

def reset_password_submit(request):
	if (request.method=='POST'):
		username = request.user.username
		pwd = request.POST["password1"]

		user = hUser.objects.get(username=username)
		user.set_password(pwd)
		user.save()

		messages.success(request, 'Password reset successfully. Please login with new password.')
		return redirect('/login')
	else:
		return redirect('/view_profile')

def update_email_submit(request):
	if (request.method=='POST'):
		username = request.POST["username"]
		mail = request.POST["email"]
		
		user = hUser.objects.get(username=username)
		user.email = mail
		user.save()

		return redirect('/view_profile')
	else:
		return redirect('/view_profile')
