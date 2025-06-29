import os
import uuid
import json
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from web3 import Web3

# Azure Face API Imports
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.core.exceptions import ServiceRequestError
from azure.cognitiveservices.vision.face.models import APIErrorException

load_dotenv()

app = Flask(__name__)
# Mengizinkan request dari frontend Next.js Anda
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


# --- KONFIGURASI ---
# Azure
AZURE_FACE_ENDPOINT = os.getenv("AZURE_FACE_ENDPOINT")
AZURE_FACE_API_KEY = os.getenv("AZURE_FACE_API_KEY")

print(f"--- MENGGUNAKAN AZURE ENDPOINT: {AZURE_FACE_ENDPOINT} ---") # Log untuk debugging

if not AZURE_FACE_ENDPOINT or not AZURE_FACE_API_KEY:
    raise ValueError("Azure credentials (AZURE_FACE_ENDPOINT, AZURE_FACE_API_KEY) are not set in .env file.")

try:
    face_client = FaceClient(AZURE_FACE_ENDPOINT, CognitiveServicesCredentials(AZURE_FACE_API_KEY))
except Exception as e:
    raise RuntimeError(f"Gagal membuat Azure FaceClient. Periksa kembali AZURE_FACE_ENDPOINT Anda. Error: {e}")


# Pinata
PINATA_BASE_URL = "https://api.pinata.cloud/"
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

# Web3/Blockchain
w3 = Web3(Web3.HTTPProvider(os.getenv("SEPOLIA_RPC_URL")))
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Load Contract ABI
try:
    with open('SoulboundIdentity.json', 'r') as f:
        contract_abi = json.load(f)['abi']
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
except FileNotFoundError:
    raise FileNotFoundError("SoulboundIdentity.json not found. Please copy it from the hardhat artifacts folder.")


# --- FUNGSI BANTUAN ---
def upload_to_ipfs(json_content):
    """Mengunggah konten JSON ke IPFS melalui layanan Pinata."""
    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        print("ERROR: Kunci API Pinata tidak diatur di file .env")
        return None

    url = f"{PINATA_BASE_URL}pinning/pinJSONToIPFS"
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }
    data = {
        "pinataContent": json_content,
        "pinataMetadata": {
            "name": f"BlockID Metadata - {uuid.uuid4()}"
        }
    }
    try:
        print("Uploading metadata to Pinata...")
        response = requests.post(url, json=data, headers=headers, timeout=10)
        response.raise_for_status()
        print("Successfully uploaded to Pinata.")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error uploading to Pinata: {e}")
        return None

# --- ENDPOINTS ---
@app.route("/api/register", methods=["POST"])
def register_identity():
    if 'faceImage' not in request.files:
        return jsonify({"error": "No face image provided"}), 400

    face_image_file = request.files['faceImage']
    
    # --- 1. Verifikasi Wajah dengan Azure Face API ---
    try:
        print("Received image for verification...")
        image_stream = io.BytesIO(face_image_file.read())

        detected_faces = face_client.face.detect_with_stream(
            image=image_stream,
            detection_model='detection_03',
            recognition_model='recognition_04',
            return_face_attributes=['qualityForRecognition']
        )

        if not detected_faces:
            return jsonify({"error": "No face detected in the image."}), 400
        if len(detected_faces) > 1:
            return jsonify({"error": "Multiple faces detected. Please provide a picture with only one face."}), 400
        
        quality = detected_faces[0].face_attributes.quality_for_recognition.value
        if quality.lower() != 'high':
            return jsonify({"error": f"Poor image quality for recognition: '{quality}'. Please provide a clearer, well-lit image."}), 400

        print("Face verification successful.")

    except APIErrorException as e:
        error_body = e.response.text
        print(f"!!! Azure API Error: {e.message}")
        print(f"!!! Response Body: {error_body}")
        # Memberikan pesan yang lebih berguna ke frontend
        error_message = f"Azure Face API Error: {e.message}. Pastikan endpoint dan API key Anda benar."
        try:
            # Mencoba mem-parse pesan error dari Azure
            error_details = json.loads(error_body)
            error_message = f"Azure Error: {error_details.get('error', {}).get('message', 'Unknown error')}"
        except json.JSONDecodeError:
            pass # Gunakan pesan default jika body bukan JSON
        return jsonify({"error": error_message}), 500
        
    except ServiceRequestError as e:
        print(f"!!! Azure Connection Error: {e}")
        return jsonify({"error": "Could not connect to Azure services. Check your endpoint URL and network connection."}), 500
    except Exception as e:
        print(f"!!! An unexpected error occurred: {e}")
        return jsonify({"error": f"An unexpected error occurred during face verification: {str(e)}"}), 500

    # --- 2. Siapkan dan Unggah Metadata ke IPFS ---
    form_data = request.form
    metadata = {
        "name": "BlockID Soulbound Token",
        "description": "This token represents a verified digital identity.",
        "attributes": [
            {"trait_type": "Full Name", "value": form_data.get("fullName")},
            {"trait_type": "NIK/Student ID", "value": form_data.get("nik")},
            {"trait_type": "Verification Date", "value": str(uuid.uuid4())},
        ]
    }

    pinata_response = upload_to_ipfs(metadata)
    if not pinata_response or "IpfsHash" not in pinata_response:
        return jsonify({"error": "Failed to upload metadata to IPFS. Check Pinata API keys."}), 500

    ipfs_hash = pinata_response["IpfsHash"]
    token_uri = f"ipfs://{ipfs_hash}"
    
    print(f"Metadata uploaded to IPFS. URI: {token_uri}")
    
    return jsonify({
        "message": "Verification successful, ready to mint.",
        "tokenUri": token_uri
    }), 200


@app.route('/api/get-status/<wallet_address>')
def get_status(wallet_address):
    try:
        if not Web3.is_address(wallet_address):
            return jsonify({'error': 'Invalid wallet address'}), 400
        
        # Cara standar ERC721 untuk memeriksa apakah sebuah alamat memiliki token.
        # Jika saldo > 0, berarti pengguna terverifikasi.
        balance = contract.functions.balanceOf(wallet_address).call()
        is_verified = balance > 0
        
        return jsonify({'isVerified': is_verified}), 200
    except Exception as e:
        print(f"Error checking status for {wallet_address}: {e}")
        return jsonify({'error': f'An error occurred while checking status: {str(e)}'}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
