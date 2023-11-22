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
from .helper import face_matcher, serve_image
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import face_recognition
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


@csrf_exempt
def detect_face(request):
    if request.method == 'POST' and request.FILES['image']:
        time.sleep(5)
        # Read the uploaded image
        uploaded_image = request.FILES['image']
        image_data = uploaded_image.read()
        image = Image.open(io.BytesIO(image_data))

        # Convert the image to a numpy array
        image_np = np.array(image)

        # Detect faces in the image
        face_locations = face_recognition.face_locations(image_np)

        # Extract face coordinates
        face_coordinates = []
        for face_location in face_locations:
            top, right, bottom, left = face_location
            face_coordinates.append({
                'top': top,
                'right': right,
                'bottom': bottom,
                'left': left
            })

        return JsonResponse({'faces': face_coordinates})

    return JsonResponse({'error': 'Invalid request'})


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the image data URI from the request data
            data_uri = request.data.get("image", "")
            name = request.data.get('full_name', "")
            # Check if the data URI is not empty
            if data_uri:
                # Split the data URI to get the Base64-encoded data
                _, base64_data = data_uri.split(",", 1)

                # Decode the Base64 data
                binary_data = base64.b64decode(base64_data)

                # Specify the file name and extension
                file_name = f"image_${name}.jpg"

                # Create a ContentFile from the binary data
                image_file = ContentFile(binary_data, name=file_name)

                # Assign the image file to the serializer's validated data
                serializer.validated_data['photo'] = image_file

            # Save the serializer with the image data
            check = face_matcher(image_file)
            if check[1]:
                return Response({"error": check[0]['message']}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
                user_info['photo'] = serve_image(user_info['photo'])
                return Response(user_info, status=status.HTTP_200_OK)

            return Response({'message': 'User Details not found'}, status=status.HTTP_401_UNAUTHORIZED)


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
    Return a list of candidates for a specific election.
    """
    try:
        candidates = Candidate.objects.filter(election_id=election_id)

    except Candidate.DoesNotExist:
        return Response({'error': 'No candidates found for this election.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CandidateSerializer(candidates, many=True)
    return Response(serializer.data)


class AddVoteView(APIView):
    def post(self, request, format=None):
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid():
            voter_email_id = request.data.get('voter_email_id')
            election_id = request.data.get('election')

            # Find the voter by email
            try:
                voter = Voter.objects.get(email=voter_email_id)
            except Voter.DoesNotExist:
                return Response({'error': 'Voter not found'}, status=status.HTTP_404_NOT_FOUND)

            # Check if the voter already voted in this election
            if Voter.objects.filter(id=voter.id, participated_in=election_id).exists():
                return Response({'error': 'You has already participated in this election'}, status=status.HTTP_400_BAD_REQUEST)

            # Save the vote and update the Voter's participated_in field
            try:
                Vote.objects.create(**serializer.validated_data)
                voter.participated_in_id = election_id
                voter.save()
                return Response({'message': 'Vote added successfully'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
