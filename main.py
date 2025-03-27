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
USDA_API_KEY = "decFnnaPbSCMIN0iXQlFxkmzenURWMHgYaRQdkY4"
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def fetch_upc_database(barcode):
    """Fetch product details from UPC Database API."""
    url = f"{UPC_LOOKUP_URL}/{barcode}?apikey={UPC_LOOKUP_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        print("📦 UPC Database Response:", data)

        if "title" in data or "brand" in data:
            # Extract nutrition data safely
            nutrition_data = data.get("metanutrition", {})

            return {
                "barcode": barcode,
                "name": data.get("title", "Unknown"),
                "brand": data.get("brand") or "Not Available",
                "category": data.get("category", "Unknown"),
                "description": data.get("description") or "No description available",
                "image": data["images"][0] if data.get("images") else None,
                "nutrition": {
                    "Calories": nutrition_data.get("energy-kcal_value", "N/A"),
                    "Fat": f"{nutrition_data.get('fat_unit', 'g')} {nutrition_data.get('fat_value', 'N/A')}",
                    "Carbohydrates": f"{nutrition_data.get('carbohydrates_unit', 'g')} {nutrition_data.get('carbohydrates_value', 'N/A')}",
                    "Proteins": f"{nutrition_data.get('proteins_unit', 'g')} {nutrition_data.get('proteins_value', 'N/A')}",
                    "Sugars": f"{nutrition_data.get('sugars_unit', 'g')} {nutrition_data.get('sugars_value', 'N/A')}",
                    "Sodium": f"{nutrition_data.get('sodium_unit', 'g')} {nutrition_data.get('sodium_value', 'N/A')}",
                },
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
        print("🥗 Open Food Facts Response:", data)

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

def fetch_usda_health_data(product_name):
    """Fetch health score and alternatives from USDA FoodData Central API."""
    url = f"{USDA_API_URL}?query={product_name}&api_key={USDA_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        print("🛒 USDA Food Data Response:", data)

        if data.get("foods"):
            foods = data["foods"]
            first_food = foods[0]

            health_score = {
                "calories": first_food["foodNutrients"][0]["value"] if first_food["foodNutrients"] else "N/A",
                "fat": next((n["value"] for n in first_food["foodNutrients"] if n["nutrientName"] == "Total lipid (fat)"), "N/A"),
                "protein": next((n["value"] for n in first_food["foodNutrients"] if n["nutrientName"] == "Protein"), "N/A"),
            }

            alternative_products = [food["description"] for food in foods[1:4]]

            return {"health_score": health_score, "alternatives": alternative_products}
    except requests.exceptions.RequestException as e:
        print(f"⚠️ USDA API Error: {e}")
    return None  # If API fails or no data found

def get_product_details(barcode):
    """Try multiple sources for product lookup and fetch health details."""
    product = fetch_upc_database(barcode) or fetch_open_food_facts(barcode)

    if product and product.get("name"):
        health_data = fetch_usda_health_data(product["name"])
        if health_data:
            product.update(health_data)

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
