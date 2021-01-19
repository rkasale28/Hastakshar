from django.db import models 
from django.contrib.auth.models import User as hUser

# Create your models here.
class User(models.Model):
    user = models.OneToOneField(hUser,on_delete=models.CASCADE)
    secondary_id=models.CharField(max_length=32,blank=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', default='profile_pics/default.jpg')