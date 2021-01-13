from .forms import RegisterForm, UserForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse
from django.contrib.auth.models import User as hUser, auth
from .models import User

# Create your views here.
def register(request):
# 	if request.method == "POST":
# 		form1 = UserForm()
# 		form2 = RegisterForm()
# 		if form1.is_valid():
# 			form.save()
# 			#messages.success(request, "Registration successful." )
# 			return redirect("/login")
# 		#messages.error(request, "Unsuccessful registration. Invalid information.")
# 	else:
	form1 = UserForm()
	form2 = RegisterForm()
	return render(request, template_name="register/register.html", context={"register_form1":form1,"register_form2":form2})

def register_submit(request):
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

def logout(request):
	auth_logout(request)
	#messages.info(request, "You have successfully logged out.") 
	return redirect("/home")