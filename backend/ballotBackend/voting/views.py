from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer
from .serializers import UserLoginSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import Voter


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyView(APIView):
    def get(self, request):
        data = {'message': 'Hello, World!'}
        return Response(data)


class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user_info = Voter.objects.values().get(email=email)
        if user_info is not None:
            if password == user_info['password']:
                return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)


class GetProfileDetails(APIView):
    def post(self, request):
        email = request.data.get('email')
        if email:
            user_info = Voter.objects.values().get(email=email)
            if user_info is not None:
                return Response(user_info, status=status.HTTP_200_OK)

            return Response({'message': 'User Details not found'}, status=status.HTTP_401_UNAUTHORIZED)
