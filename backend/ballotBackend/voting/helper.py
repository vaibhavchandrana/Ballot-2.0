import face_recognition
import cv2
import numpy as np
import os
from pathlib import Path
from django.http import HttpResponse
from django.conf import settings
import os
import base64


from django.http import JsonResponse


# Django view
def serve_image(image_name):
    # Construct the image URL
    image_url = f'{settings.MEDIA_URL}{image_name}'
    return image_url


def face_matcher(file_obj, photos_directory='media/photos'):
    # Load the uploaded image file
    img = face_recognition.load_image_file(file_obj)
    # Detect faces in the uploaded image
    uploaded_face_encodings = face_recognition.face_encodings(img)

    if not uploaded_face_encodings:
        return [{"message": "No faces detected in the uploaded image."}, True]

    # Iterate over the images in the local photos directory
    for image_path in Path(photos_directory).glob('*'):
        # Only process files with .png, .jpg, or .jpeg extensions
        if image_path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
            # Load each image
            current_img = face_recognition.load_image_file(image_path)
            # Detect faces in the current image
            known_face_encodings = face_recognition.face_encodings(current_img)

            # Compare faces
            for known_face in known_face_encodings:
                results = face_recognition.compare_faces(
                    uploaded_face_encodings, known_face)
                if True in results:
                    return [{"message": "You are already a user"}, True]

    return [{"message": "Faces detected"}, False]

# Example usage:
# with open("path_to_your_image.jpg", "rb") as file_obj:
#     result, success = face_matcher(file_obj=file_obj)
