import requests
from fastapi import FastAPI, File, UploadFile
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys & URLs
UPC_LOOKUP_API_KEY = "B6707C152D99C6033073D5BF345D4215"
UPC_LOOKUP_URL = "https://api.upcdatabase.org/product"
OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

def fetch_upc_database(barcode):
    """Fetch product details from UPC Database API."""
    url = f"{UPC_LOOKUP_URL}/{barcode}?apikey={UPC_LOOKUP_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        print("📦 UPC Database Response:", data)

        if "title" in data or "brand" in data:
            return {
                "barcode": barcode,
                "name": data.get("title", "Unknown"),
                "brand": data.get("brand", "Unknown"),
                "category": data.get("category", "Unknown"),
                "description": data.get("description", "Not available"),
                "image": data["images"][0] if data.get("images") else None,
                "nutrition": data.get("metanutrition", {}),
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠️ UPC Database API Error: {e}")
    return None  # If API fails or product not found

def fetch_open_food_facts(barcode):
    """Fetch product details from Open Food Facts API."""
    url = f"{OPENFOODFACTS_URL}/{barcode}.json"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        print("🥗  Open Food Facts Response:", data)

        if "product" in data:
            product = data["product"]
            return {
                "barcode": barcode,
                "name": product.get("product_name", "Unknown"),
                "brand": product.get("brands", "Unknown"),
                "category": product.get("categories", "Unknown"),
                "description": product.get("generic_name", "Not available"),
                "image": product.get("image_url", None),
                "nutrition": product.get("nutriments", {}),
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Open Food Facts API Error: {e}")
    return None  # If API fails or product not found

def get_product_details(barcode):
    """Try multiple sources for product lookup."""
    product = fetch_upc_database(barcode) or fetch_open_food_facts(barcode)
    return product if product else {"barcode": barcode, "error": "Product not found"}

@app.post("/scan-barcode/")
async def scan_barcode(file: UploadFile = File(...)):
    """Scan barcode from uploaded image and fetch product details."""
    try:
        image = Image.open(BytesIO(await file.read()))
        print("🖼️ Image loaded successfully")

        barcodes = decode(image)
        if not barcodes:
            return {"error": "No barcode found in the image"}

        barcode_data = barcodes[0].data.decode("utf-8")
        barcode_type = barcodes[0].type
        print(f"✅ Detected barcode: {barcode_data}, Type: {barcode_type}")

        product_details = get_product_details(barcode_data)
        return product_details

    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return {"error": "Failed to process the image"}
