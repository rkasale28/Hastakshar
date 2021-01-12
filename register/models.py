from django.db import models

# Create your models here.
class UserProfiles(models.Model):
    username = models.CharField(max_length=25, unique=True, default='')
    first_name = models.CharField(max_length=25, default='')
    last_name = models.CharField(max_length=25, default='')
    email = models.EmailField(max_length=100, unique=True, default='')
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True)
    password1 = models.CharField(max_length=25)
    password2 = models.CharField(max_length=25)