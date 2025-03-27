import requests
from fastapi import FastAPI, File, UploadFile
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],  # Update this to match your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

# Fetch product details
def fetch_product(barcode):
    try:
        response = requests.get(f"{OPENFOODFACTS_URL}/{barcode}.json", timeout=5)
        response.raise_for_status()
        data = response.json()

        if "product" in data:
            product = data["product"]
            
            # Extract relevant fields
            return {
                "barcode": barcode,
                "name": product.get("product_name", "Unknown"),
                "brand": product.get("brands", "Not Available"),
                "category": product.get("categories", "Unknown"),
                "description": product.get("generic_name", "No description available"),
                "image": product.get("image_url", None),  # Product Image
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
        print(f"⚠️ API Error: {e}")
    
    return {"barcode": barcode, "error": "Product not found"}

# API to scan barcode from image
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

# API to get product details by barcode
@app.get("/get-product/{barcode}")
async def get_product(barcode: str):
    return fetch_product(barcode)
