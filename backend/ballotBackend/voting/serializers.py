from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Voter
from django.core.files import File
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password

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

