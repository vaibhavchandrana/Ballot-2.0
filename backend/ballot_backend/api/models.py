from django.db import models

# Create your models here.
class User(models.Model):
    name=models.CharField(max_length=200)
    email=models.EmailField()
    phone=models.CharField(max_length=15)
    age =models.IntegerField()
    password=models.CharField(max_length=500)
    voter_id=models.IntegerField()
    flag=models.IntegerField(default=0)



class Candidate(models.Model):
    name=models.CharField(max_length=20)
    party=models.CharField(max_length=100)
    votes=models.IntegerField(default=0)

