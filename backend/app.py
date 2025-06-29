import os
import uuid
import json
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from web3 import Web3

# ... (semua impor tetap sama)
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.core.exceptions import ServiceRequestError
from azure.cognitiveservices.vision.face.models import APIErrorException

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- TAMBAHKAN VARIABEL INI ---
# Ubah menjadi False jika Anda sudah mendapatkan approval dari Azure
SIMULATE_AZURE_SUCCESS = True 

# ... (Konfigurasi Azure, Pinata, Web3 tetap sama)
AZURE_FACE_ENDPOINT = os.getenv("AZURE_FACE_ENDPOINT")
AZURE_FACE_API_KEY = os.getenv("AZURE_FACE_API_KEY")
face_client = FaceClient(AZURE_FACE_ENDPOINT, CognitiveServicesCredentials(AZURE_FACE_API_KEY)) if not SIMULATE_AZURE_SUCCESS else None


# ... (Fungsi upload_to_ipfs dan endpoint get_status tetap sama)

# --- ENDPOINTS ---
@app.route("/api/register", methods=["POST"])
def register_identity():
    if 'faceImage' not in request.files:
        return jsonify({"error": "No face image provided"}), 400

    if not SIMULATE_AZURE_SUCCESS:
        # --- 1. JALUR KODE AZURE YANG SEBENARNYA ---
        try:
            # ... (kode try...except untuk verifikasi Azure yang sudah kita buat sebelumnya)
            face_image_file = request.files['faceImage']
            image_stream = io.BytesIO(face_image_file.read())

            detected_faces = face_client.face.detect_with_stream(
                image=image_stream,
                detection_model='detection_03',
                recognition_model='recognition_04',
                return_face_attributes=['qualityForRecognition']
            )

            if not detected_faces: return jsonify({"error": "Wajah tidak terdeteksi."}), 400
            if len(detected_faces) > 1: return jsonify({"error": "Terdeteksi lebih dari satu wajah."}), 400
            
            quality = detected_faces[0].face_attributes.quality_for_recognition.value
            if quality.lower() != 'high': return jsonify({"error": f"Kualitas gambar buruk: '{quality}'."}), 400

            print("Verifikasi wajah via Azure berhasil.")

        except APIErrorException as e:
            # ... (penanganan error Azure)
            error_body = e.response.text
            print(f"Azure API Error: {error_body}")
            return jsonify({"error": f"Azure API Error: {e.message}"}), 500
        except Exception as e:
            return jsonify({"error": f"Terjadi error tak terduga: {str(e)}"}), 500
    else:
        # --- 1. JALUR SIMULASI ---
        print("!!! SIMULASI AKTIF: Melewatkan verifikasi Azure dan menganggapnya berhasil. !!!")


    # --- 2. Siapkan dan Unggah Metadata ke IPFS (Jalur ini berjalan untuk keduanya) ---
    form_data = request.form
    metadata = {
        "name": "BlockID Soulbound Token (Simulated)",
        "description": "This token represents a verified digital identity.",
        "attributes": [
            {"trait_type": "Full Name", "value": form_data.get("fullName")},
            {"trait_type": "NIK/Student ID", "value": form_data.get("nik")},
            {"trait_type": "Verification Date", "value": str(uuid.uuid4())},
        ]
    }
    
    # Ganti dengan fungsi upload_to_ipfs asli jika ingin menguji Pinata
    # pinata_response = upload_to_ipfs(metadata)
    # ...
    
    token_uri = f"ipfs://SIMULATED_HASH_FOR_{form_data.get('fullName')}" # Simulasi hash IPFS
    
    print(f"Metadata siap. URI: {token_uri}")
    
    return jsonify({
        "message": "Verification successful (SIMULATED), ready to mint.",
        "tokenUri": token_uri
    }), 200

# ... (sisa kode)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
