
from django.db import models
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Voter(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    photo = models.ImageField(upload_to='photos/')
    participated_in = models.ManyToManyField('Election', blank=True)
    uuid = models.UUIDField(null=True, blank=True)

    def __str__(self):
        return self.full_name


class Candidate(models.Model):
    name = models.CharField(max_length=255)
    subinformation = models.TextField(blank=True, null=True)
    election = models.ForeignKey('Election', on_delete=models.CASCADE, related_name='candidates', null=True)
    photo = models.ImageField(upload_to='candidate_photos/', null=True, blank=True)

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
    ACCESS_TYPE = (('OPEN_FOR_ALL', 'open_for_all'), ("VIA_PASSWORD", "via_password"))
    election_name = models.CharField(max_length=255)
    generation_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    created_by = models.ForeignKey('Admin', on_delete=models.CASCADE, null=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE, default="open_for_all")
    status = models.CharField(max_length=10, choices=ELECTION_STATUS_CHOICES, default='Open')
    password = models.CharField(max_length=128)
    make_result_pubic=models.BooleanField(default=True)

    def __str__(self):
        return self.election_name


class Vote(models.Model):
    candidate = models.ForeignKey('Candidate', on_delete=models.CASCADE, related_name='votes')
    election = models.ForeignKey('Election', on_delete=models.CASCADE, related_name='candidate_votes')
    time_cast = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Vote for {self.candidate.name} in {self.election.election_name} at {self.time_cast}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # After saving the vote, send the updated results
        self.notify_election_results()

    def notify_election_results(self):
        channel_layer = get_channel_layer()
        if channel_layer is None:
            raise RuntimeError("Channel layer is not configured properly.")
        
        election_id = self.election.id
        election = Election.objects.get(id=election_id)

        candidates = self.get_candidates_with_votes(election)
        data = {
            "candidates": candidates,
        }

        async_to_sync(channel_layer.group_send)(
            f'election_{election_id}',
            {
                'type': 'send_election_results',
                'data': data,
            }
        )

    @staticmethod
    def get_candidates_with_votes(election):
        candidates = []
        for candidate in election.candidates.all():
            no_of_votes = candidate.votes.count()  # Count the votes for each candidate
            candidates.append({
                "id": candidate.id,
                "name": candidate.name,
                "subinformation": candidate.subinformation,
                "photo": candidate.photo.url if candidate.photo else None,
                "election": election.id,
                "no_of_votes": no_of_votes,
            })
        return candidates