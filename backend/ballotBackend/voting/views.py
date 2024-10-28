from .serializers import AdminSerializer
from .models import Admin
from .serializers import VoteSerializer
from .models import Vote, Voter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer
from .serializers import ElectionSerializer, ElectionSerializerAdmin
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import Voter, Election
from django.core.files.base import ContentFile
import base64
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import numpy as np
import io
import time
from rest_framework.decorators import api_view
from .models import Candidate
from .serializers import CandidateSerializer
from rest_framework import viewsets
from django.db.models import Count
from rest_framework.exceptions import NotFound, ValidationError
from .face_recognition import process_image,compare_image_with_embedding

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Extract image data from request
            image_data = request.data.get("image", "")

            # Check if image data is provided
            if not image_data:
                return Response({"error": "Image data not provided."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Decode the base64 image data to bytes
                header, image_data_base64 = image_data.split(',', 1)
                image_data_bytes = base64.b64decode(image_data_base64)
            except Exception as e:
                return Response({"error": f"Invalid image format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Extract face embedding from image data
            uuid, message = process_image(image_data_bytes)

            if uuid is None:
                return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

            # Assign the embedding to the serializer's validated data
            serializer.validated_data['uuid'] = uuid

            # Save the image to the database
            image_file = ContentFile(image_data_bytes, name=f"{uuid}.jpg")
            serializer.validated_data['photo'] = image_file

            # Save the serializer with the image data
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user_info = Voter.objects.get(email=email)
        except Voter.DoesNotExist:
            return Response({'message': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        if password == user_info.password:
            return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)



class GetProfileDetails(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'message': 'Email not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_info = Voter.objects.values().get(email=email)
            # Construct the complete URL for serving the image
            photo_url = f"http://127.0.0.1:8000/media/{user_info['photo']}"
            user_info['photo'] = photo_url
            return Response(user_info, status=status.HTTP_200_OK)
        except Voter.DoesNotExist:
            return Response({'message': 'User Details not found'}, status=status.HTTP_404_NOT_FOUND)


class ElectionAPIView(APIView):
    def post(self, request):
        serializer = ElectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, election_id=None):
        if election_id != 0:
            try:
                election = Election.objects.get(id=election_id)
                # Check if the expiry date is in the past
                if election.expiry_date < date.today():
                    election.status = 'Closed'
                    election.save()  # Update the status in the database

                serializer = ElectionSerializer(election)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Election.DoesNotExist:
                return Response({"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            elections = Election.objects.annotate(
                candidates_count=Count('candidates')).all()
            serializer = ElectionSerializer(elections, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class ElectionAdminAPIView(APIView):
    def get(self, request, election_id=None, admin_id=None):
        if election_id != 0:
            try:
                election = Election.objects.get(id=election_id)
                # Check if the expiry date is in the past
                if election.expiry_date < date.today():
                    election.status = 'Closed'
                    election.save()  # Update the status in the database

                serializer = ElectionSerializerAdmin(election)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Election.DoesNotExist:
                return Response({"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND)
        elif admin_id:
            elections = Election.objects.get(created_by=admin_id)
            serializer = ElectionSerializer(elections, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            elections = Election.objects.all()
            serializer = ElectionSerializer(elections, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class ElectionViaAdminAPIView(APIView):
    def get(self, request, admin_id=None):
        # Check if admin_id is provided
        if not admin_id:
            raise ValidationError({"error": "Admin ID must be provided."})

        # Check if the admin exists
        try:
            admin = Admin.objects.get(id=admin_id)
        except Admin.DoesNotExist:
            raise NotFound({"error": "Admin not found."})

        # Get elections created by the admin
        elections = Election.objects.filter(created_by=admin)

        # Check if the admin has created any elections
        if not elections:
            return Response({"message": "No elections found for the given admin."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ElectionSerializer(elections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_candidate(request):
    """
    Add a new candidate.
    """
    # Create a new Candidate instance using the data from the request
    serializer = CandidateSerializer(data=request.data)

    # Check if the serializer is valid
    if serializer.is_valid():
        # Save the new Candidate instance
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # Return an error response if the data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def check_password_for_election(request):
    """
    Check if the entered password for an election is correct.
    """
    entered_password = request.data.get('password')
    election_id = request.data.get('election_id')

    try:
        election = Election.objects.get(pk=election_id)
    except Election.DoesNotExist:
        return Response({'error': "Election not found"}, status=status.HTTP_404_NOT_FOUND)

    if election.password == entered_password:
        return Response({'message': "Password is correct"}, status=status.HTTP_200_OK)
    else:
        return Response({'error': "Password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def edit_candidate(request, pk):
    """
    Edit an existing candidate.
    """
    try:
        candidate = Candidate.objects.get(pk=pk)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CandidateSerializer(candidate, data=request.data)
    else:  # PATCH
        serializer = CandidateSerializer(
            candidate, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_candidate(request, pk):
    """
    Edit an existing candidate.
    """
    try:
        candidate = Candidate.objects.get(pk=pk)
        candidate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Candidate.DoesNotExist:
        return Response(
            {"error": "Candidate not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def candidates_by_election(request, election_id):
    """
    Return a list of candidates and election details for a specific election.
    """
    try:
        election = Election.objects.get(pk=election_id)
        candidates = Candidate.objects.filter(election_id=election_id)
    except Election.DoesNotExist:
        return Response({'error': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Candidate.DoesNotExist:
        return Response({'error': 'No candidates found for this election.'}, status=status.HTTP_404_NOT_FOUND)

    election_serializer = ElectionSerializer(election)
    candidates_serializer = CandidateSerializer(candidates, many=True)
    return Response({
        'election': election_serializer.data,
        'candidates': candidates_serializer.data
    })


class AddVoteView(APIView):
    def post(self, request, format=None):
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid():
            voter_email_id = request.data.get('voter_email_id')
            election_id = request.data.get('election')
            image_uri = request.data.get('image_uri')

            # Find the voter by email
            try:
                voter = Voter.objects.get(email=voter_email_id)
            except Voter.DoesNotExist:
                return Response({'error': 'Voter not found'}, status=status.HTTP_404_NOT_FOUND)

            # Check if the voter already voted in this election
            election = Election.objects.get(id=election_id)
            if election in voter.participated_in.all():
                return Response({'error': 'You have already participated in this election'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Decode the base64 image data to bytes
            try:
                header, image_data_base64 = image_uri.split(',', 1)
                image_data_bytes = base64.b64decode(image_data_base64)
            except Exception as e:
                return Response({"error": f"Invalid image format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            if compare_image_with_embedding(image_data_bytes, voter.uuid):
                try:
                    Vote.objects.create(**serializer.validated_data)
                    voter.participated_in.add(election)
                    return Response({'message': 'Vote added successfully'}, status=status.HTTP_201_CREATED)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'error': 'Your face is not matched with your saved image'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


class AdminLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            admin = Admin.objects.get(email=email)
        except Admin.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        if check_password(password, admin.password):
            serializer = AdminSerializer(admin)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_admin(request):
    serializer = AdminSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
