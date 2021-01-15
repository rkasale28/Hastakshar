import re
from django.contrib.auth.models import User
from django.http import JsonResponse
from validate_email import validate_email as valid_email

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
	
	upper_case_alphabet_pattern = ".*[A-Z]+.*"
	lower_case_alphabet_pattern = ".*[a-z]+.*"
	digit_pattern = ".*[0-9]+.*"
	
	data = {
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