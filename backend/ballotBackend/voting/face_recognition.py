import os
import cv2
import numpy as np
from deepface import DeepFace
import uuid
from pinecone import Pinecone, ServerlessSpec
from typing import List
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import UploadedFile

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Pinecone client
api_key = "2a2dd7eb-7623-468a-b892-645c76d5672e"
pc = Pinecone(api_key=api_key)
index_name = "ballot-knownfaces"

# Create or access the index with correct dimension
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=4096,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

index = pc.Index(index_name)

# Store embeddings in memory for verification
embedding_store = {}

def normalize_vector(vector: np.ndarray) -> np.ndarray:
    """Normalize vector and ensure it's in the correct format for Pinecone."""
    vector = vector.astype(np.float32)
    norm = np.linalg.norm(vector)
    if norm == 0:
        return np.zeros_like(vector)
    normalized = vector / norm
    normalized = np.nan_to_num(normalized, nan=0.0, posinf=0.0, neginf=0.0)
    return normalized

def calculate_similarity(vector1: np.ndarray, vector2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors directly."""
    vector1_norm = normalize_vector(vector1)
    vector2_norm = normalize_vector(vector2)
    dot_product = np.dot(vector1_norm, vector2_norm)
    similarity = (dot_product + 1) / 2
    return round(similarity * 100, 2)

def verify_face(img_path: str) -> dict:
    """Verify face in image and get confidence score."""
    try:
        result = DeepFace.verify(
            img1_path=img_path,
            img2_path=img_path,
            model_name="VGG-Face",
            detector_backend="retinaface"
        )
        return {
            "verified": result.get("verified", False),
            "confidence": result.get("distance", 0.0)
        }
    except Exception as e:
        logger.error(f"Face verification failed: {str(e)}")
        return {"verified": False, "confidence": 0.0}

def get_face_embedding(image_array: np.ndarray) -> tuple:
    """Extract face embedding using DeepFace."""
    try:
        temp_path = f"temp_image_{uuid.uuid4()}.jpg"
        cv2.imwrite(temp_path, image_array)
        verification = verify_face(temp_path)
        result = DeepFace.represent(
            img_path=temp_path,
            model_name="VGG-Face",
            enforce_detection=True,
            detector_backend="retinaface"
        )
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if not result or len(result) == 0:
            raise ValueError("No face embedding generated")
        embedding = np.array(result[0]["embedding"])
        confidence = 100 * (1 - min(verification["confidence"], 1.0))
        logger.info(f"Face detection confidence: {confidence}%")
        return embedding, confidence
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        logger.error(f"Face embedding extraction failed: {str(e)}")
        raise ValueError(f"Face embedding extraction failed: {str(e)}")

def process_image(image_data: bytes):
    try:
        image_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        if image is None:
            return None, "Invalid image format"
        
        original_embedding, confidence = get_face_embedding(image)
        normalized_embedding = normalize_vector(original_embedding)
        query_vector = normalized_embedding.tolist()
        
        try:
            query_results = index.query(
                vector=query_vector,
                top_k=5,
                include_values=True
            )
        except Exception as e:
            logger.error(f"Pinecone query failed: {str(e)}")
            return None, f"Failed to perform similarity search: {str(e)}"
        
        if 'matches' in query_results:
            for match in query_results['matches']:
                pinecone_similarity = (match['score']) * 100
                if pinecone_similarity > 70:
                    return None, "Face already exists"
        
        embedding_uuid = str(uuid.uuid4())
        embedding_store[embedding_uuid] = {
            'embedding': original_embedding,
            'confidence': confidence
        }
        
        try:
            index.upsert(vectors=[(embedding_uuid, query_vector)])
            logger.info(f"Successfully stored embedding: UUID: {embedding_uuid}, Confidence: {confidence}%, Embedding dimension: {len(query_vector)}")
        except Exception as e:
            logger.error(f"Failed to store embedding: {str(e)}")
            return None, f"Failed to store embedding: {str(e)}"
        
        return embedding_uuid, "Face saved"
    except Exception as e:
        logger.error(f"Error in process_image: {str(e)}")
        return None, str(e)

def compare_image_with_embedding(image_data: bytes, embedding_uuid: str) -> bool:
    """Compare an image byte with a stored embedding using the given UUID."""
    try:
        image_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        if image is None:
            logger.error("Invalid image format")
            return False
        
        new_embedding, _ = get_face_embedding(image)
        stored_embedding_info = index.fetch([str(embedding_uuid)])
        
        if stored_embedding_info is None or 'vectors' not in stored_embedding_info or str(embedding_uuid) not in stored_embedding_info['vectors']:
            logger.error(f"No embedding found for UUID: {embedding_uuid}")
            return False
        
        stored_embedding = np.array(stored_embedding_info['vectors'][str(embedding_uuid)]['values'])
        similarity = calculate_similarity(new_embedding, stored_embedding)
        logger.info(f"Calculated similarity: {similarity}%")
        
        return similarity > 70
    except Exception as e:
        logger.error(f"Error in compare_image_with_embedding: {str(e)}")
        return False

@csrf_exempt
def clear_index(request):
    if request.method == 'POST':
        try:
            index.delete(delete_all=True)
            embedding_store.clear()
            return JsonResponse({"message": "Index cleared successfully"})
        except Exception as e:
            return JsonResponse({"detail": str(e)}, status=500)