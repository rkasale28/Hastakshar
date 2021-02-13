import re
from django.contrib.auth.models import User, auth
from django.http import JsonResponse
from validate_email import validate_email as valid_email
from .models import User as hUser

def validate_email(request):
	email = request.GET.get('email', None)
		
	data = {
		'invalid' : not (len(email)==0 or valid_email(email))
    }
	
	return JsonResponse(data)

def validate_username(request):
	username = request.GET.get('username', None)
	
	alphabet_pattern = ".*[a-zA-Z]+.*"
	digit_pattern = ".*[0-9]+.*"
	
	data = {
        'is_taken': User.objects.filter(username=username).exists(),
		'alphabet' : not bool(re.match(alphabet_pattern,username)),
		'digit' : not bool(re.match(digit_pattern, username)),
		'length' : (len(username)<6)
    }
	
	return JsonResponse(data)

def validate_password(request):
	password = request.GET.get('password', None)
	username = request.GET.get('username')

	user = auth.authenticate(username=username,password=password)
	
	upper_case_alphabet_pattern = ".*[A-Z]+.*"
	lower_case_alphabet_pattern = ".*[a-z]+.*"
	digit_pattern = ".*[0-9]+.*"
	
	data = {
		'exists' : user is not None,
		'upper_case_alphabet' : not bool(re.match(upper_case_alphabet_pattern,password)),
		'lower_case_alphabet' : not bool(re.match(lower_case_alphabet_pattern,password)),
		'digit' : not bool(re.match(digit_pattern, password)),
		'special_character': not bool(set('[~!-@#$%^&*()_+{}":;\']+$').intersection(password)),
		'length' : (len(password)<6)
    }
	
	return JsonResponse(data)

def validate_username_exists(request):
	username = request.GET.get('username', None)
	
	data = {
        'exists': not User.objects.filter(username=username).exists()		
    }
	
	return JsonResponse(data)

def get_email(request):	
	username = request.GET.get('username', None)
	user = User.objects.get(username=username)
	
	data = {
        'email': user.email		
    }
	
	return JsonResponse(data)

def get_data(request):
	userid = request.GET.get('userid', None)

	huser = hUser.objects.get(secondary_id=userid)

	data = {
		'full_name' : huser.user.first_name + " " + huser.user.last_name,
		'profile_picture' : huser.profile_picture.url
	}

	return JsonResponse(data)

def validate_roomcode(request):
	roomcode = request.GET.get('roomcode', None)
	
	data = {
		'special_character': bool(set('[~!-@#$%^&*()_+{}":;\']+$').intersection(roomcode)),
		'length' : (len(roomcode)!=32)
    }
	
	return JsonResponse(data)

def validate_reset_email(request):
	username = request.GET.get('username', None)
	email = request.GET.get('email', None)

	user = User.objects.get(username=username)

	data = {
		'invalid' : not (len(email)==0 or valid_email(email)),
		'same' : email == user.email
    }
	
	return JsonResponse(data)
