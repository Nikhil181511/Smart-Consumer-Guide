import requests
from fastapi import FastAPI, File, UploadFile
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import ollama
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://smart-consumer-guide.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API URLs & Keys
OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"
UPC_LOOKUP_API_KEY = "B6707C152D99C6033073D5BF345D4215"
UPC_LOOKUP_URL = "https://api.upcdatabase.org/product"

# Fetch product details from OpenFoodFacts
def fetch_product_openfoodfacts(barcode: str):
    try:
        response = requests.get(f"{OPENFOODFACTS_URL}/{barcode}.json", timeout=5)
        response.raise_for_status()
        data = response.json()

        if "product" in data:
            product = data["product"]
            return {
                "barcode": barcode,
                "name": product.get("product_name", "Unknown"),
                "brand": product.get("brands", "Not Available"),
                "category": product.get("categories", "Unknown"),
                "description": product.get("generic_name", "No description available"),
                "image": product.get("image_url", None),
                "source": "OpenFoodFacts",
                "nutrition": {
                    "energy": product.get("nutriments", {}).get("energy-kcal", "N/A"),
                    "fat": product.get("nutriments", {}).get("fat", "N/A"),
                    "saturated_fat": product.get("nutriments", {}).get("saturated-fat", "N/A"),
                    "carbohydrates": product.get("nutriments", {}).get("carbohydrates", "N/A"),
                    "sugars": product.get("nutriments", {}).get("sugars", "N/A"),
                    "fiber": product.get("nutriments", {}).get("fiber", "N/A"),
                    "salt": product.get("nutriments", {}).get("salt", "N/A"),
                    "proteins": product.get("nutriments", {}).get("proteins", "N/A"),
                }
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠ OpenFoodFacts API Error: {e}")

    return None

# Fetch product details from UPC Database
def fetch_product_upc_database(barcode: str):
    try:
        response = requests.get(f"{UPC_LOOKUP_URL}/{barcode}?apikey={UPC_LOOKUP_API_KEY}", timeout=5)
        response.raise_for_status()
        data = response.json()

        if "title" in data:
            return {
                "barcode": barcode,
                "name": data.get("title", "Unknown"),
                "brand": data.get("brand", "Not Available"),
                "category": "Unknown",
                "description": data.get("description", "No description available"),
                "image": data.get("images", [None])[0],  # First image in list
                "source": "UPC Database",
                "nutrition": {}  # UPC Database does not provide detailed nutrition info
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠ UPC Database API Error: {e}")

    return None

# Main function to fetch product details using both APIs
def fetch_product(barcode: str):
    product = fetch_product_openfoodfacts(barcode)
    
    if not product:  # If OpenFoodFacts fails, try UPC Database
        product = fetch_product_upc_database(barcode)

    return product if product else {"barcode": barcode, "error": "Product not found"}

# Scan barcode and fetch product details
@app.post("/scan-barcode/")
async def scan_barcode(file: UploadFile = File(...)):
    try:
        image = Image.open(BytesIO(await file.read()))
        barcodes = decode(image)
        
        if not barcodes:
            return {"error": "No barcode found"}

        barcode_data = barcodes[0].data.decode("utf-8")
        return fetch_product(barcode_data)

    except Exception as e:
        return {"error": "Failed to process the image"}

# Get product details directly via barcode input
@app.get("/get-product/{barcode}")
async def get_product(barcode: str):
    return fetch_product(barcode)

# Format chatbot response into bullet points
def format_response_to_bullets(response_text: str) -> str:
    sentences = response_text.split(". ")
    bullet_points = [f"- {sentence.strip()}" for sentence in sentences if sentence.strip()]
    formatted_response = "\n".join(bullet_points)
    return formatted_response

# AI Chatbot API
@app.post("/chat")
async def chat(data: dict):
    user_message = data.get("text", "")
    product_details = data.get("product", {})

    # Context-aware prompt
    context = f"The user is asking about {product_details.get('name', 'a product')}. "
    context += f"Here are some details: {product_details}. " if product_details else ""
    context += "Respond in a helpful and concise way using bullet points."

    try:
        response = ollama.chat(
            model="phi",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": context + user_message},
            ],
        )

        formatted_response = format_response_to_bullets(response["message"]["content"])
        return {"response": formatted_response}

    except Exception as e:
        return {"response": "Error: Unable to process the request"}
