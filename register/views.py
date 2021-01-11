from .forms import RegisterForm
from django.shortcuts import render, redirect
from django.contrib import messages

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
		
	return render(response, template_name="register/register.html", context={"form":form})