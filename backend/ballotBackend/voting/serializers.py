from .models import Vote
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Voter, Election
from django.core.files import File
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import Candidate
from .models import Admin


# class AdminSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Admin
#         fields = ['id', 'full_name', 'email', 'phone_number', 'password']


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'full_name', 'email', 'phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class CandidateSerializer(serializers.ModelSerializer):
    no_of_votes = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = ['id', 'name', 'subinformation',
                  'photo', 'election', 'no_of_votes']

    def get_no_of_votes(self, obj):
        # Calculate the number of votes for the candidate
        return Vote.objects.filter(candidate=obj).count()

    def create(self, validated_data):
        # Handle file upload during object creation
        return Candidate.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Handle file upload during object update
        instance.photo = validated_data.get('photo', instance.photo)
        # Update other fields as necessary
        return super().update(instance, validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Voter
        fields = ['id', 'full_name', 'email', 'age',
                  'phone_number', 'password', 'photo']
        extra_kwargs = {
            'password': {'write_only': True},
            'photo': {'required': False}
        }

    def validate_email(self, value):
        if Voter.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email address already in use.')
        return value

    def validate_phone_number(self, value):
        if Voter.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('Phone number already in use.')
        return value

    def validate_age(self, value):
        if value <= 14:
            raise serializers.ValidationError('Age must be greater than 14.')
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(
            validated_data.get('password'))
        return super().create(validated_data)

    def create(self, validated_data):
        photo = validated_data.pop('photo', None)
        instance = super().create(validated_data)

        if photo:
            instance.photo.save(photo.name, File(photo))

        return instance


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get(
            'request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        attrs['user'] = user
        return attrs


class ElectionSerializer(serializers.ModelSerializer):
    created_by_admin = AdminSerializer(source='created_by', read_only=True)
    candidates_count = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'election_name', 'generation_date',
                  'expiry_date', 'created_by_admin', 'access_type',
                  'status', 'candidates_count']

    def get_candidates_count(self, obj):
        return obj.candidates.count()

    def validate(self, data):
        election_name = data.get('election_name')
        password = data.get('password')
        generation_date = data.get('generation_date')
        expiry_date = data.get('expiry_date')

        # Check if election name and password are the same
        if election_name == password:
            raise serializers.ValidationError(
                "Election name and password cannot be the same.")

        # Check if expiry date is greater than generation date
        if generation_date and expiry_date and generation_date >= expiry_date:
            raise serializers.ValidationError(
                "Expiry date must be greater than the generation date.")

        return data


class ElectionSerializerAdmin(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'

    def validate(self, data):
        election_name = data.get('election_name')
        password = data.get('password')
        generation_date = data.get('generation_date')
        expiry_date = data.get('expiry_date')

        # Check if election name and password are the same
        if election_name == password:
            raise serializers.ValidationError(
                "Election name and password cannot be the same.")

        # Check if expiry date is greater than generation date
        if generation_date and expiry_date and generation_date >= expiry_date:
            raise serializers.ValidationError(
                "Expiry date must be greater than the generation date.")

        return data


class VoteSerializer(serializers.ModelSerializer):
    # Define your fields here, if there are any additional fields

    class Meta:
        model = Vote
        # Update this with the actual fields of your Vote model
        fields = ['candidate', 'election', 'time_cast']

    def create(self, validated_data):
        # Handle the creation of a Vote instance
        # Adjust the following line according to your model's fields and logic
        return Vote.objects.create(**validated_data)
