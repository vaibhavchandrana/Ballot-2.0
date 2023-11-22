from django.utils import timezone
from django.db import models


class Voter(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    photo = models.ImageField(upload_to='photos/')
    participated_in = models.ForeignKey(
        'Election', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.full_name


class Candidate(models.Model):
    name = models.CharField(max_length=255)
    subinformation = models.TextField(blank=True, null=True)
    election = models.ForeignKey(
        'Election', on_delete=models.CASCADE, related_name='candidates', null=True)
    photo = models.ImageField(
        upload_to='candidate_photos/', null=True, blank=True)

    def __str__(self):
        return self.name


class Admin(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.full_name


class Election(models.Model):
    ELECTION_STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    )
    ACCESS_TYPE = (('OPEN_FOR_ALL', 'open_for_all'), ("VIA_URL", "via_url"))

    election_name = models.CharField(max_length=255)
    generation_date = models.DateField()
    expiry_date = models.DateField()
    created_by = models.ForeignKey(
        'Admin', on_delete=models.CASCADE, null=True)
    access_type = models.CharField(
        max_length=20, choices=ACCESS_TYPE, default="open_for_all")
    status = models.CharField(
        max_length=10, choices=ELECTION_STATUS_CHOICES, default='Open')
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.election_name


class Vote(models.Model):
    candidate = models.ForeignKey(
        'Candidate', on_delete=models.CASCADE, related_name='votes')
    election = models.ForeignKey(
        'Election', on_delete=models.CASCADE, related_name='candiatevotes')
    time_cast = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Vote for {self.candidate.name} in {self.election.election_name} at {self.time_cast}"
