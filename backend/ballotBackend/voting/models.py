from django.db import models


class Voter(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    photo = models.ImageField(upload_to='photos/')

    def __str__(self):
        return self.full_name
