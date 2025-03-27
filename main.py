import requests
from fastapi import FastAPI, File, UploadFile
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPC_LOOKUP_URL = "https://api.upcdatabase.org/product"
OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

def fetch_product(barcode):
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
                "nutrition": product.get("nutriments", {}),
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠️ API Error: {e}")
    return {"barcode": barcode, "error": "Product not found"}

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

@app.get("/get-product/{barcode}")
async def get_product(barcode: str):
    return fetch_product(barcode)
