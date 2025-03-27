# # import requests
# # from fastapi import FastAPI, File, UploadFile
# # from pyzbar.pyzbar import decode
# # from PIL import Image
# # from io import BytesIO
# # from fastapi.middleware.cors import CORSMiddleware

# # app = FastAPI()

# # # Enable CORS for frontend connection
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],  # Update this to match your frontend
# #     allow_credentials=True,
# #     allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
# #     allow_headers=["*"],  # Allow all headers
# # )
# # OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

# # # Fetch product details
# # def fetch_product(barcode):
# #     try:
# #         response = requests.get(f"{OPENFOODFACTS_URL}/{barcode}.json", timeout=5)
# #         response.raise_for_status()
# #         data = response.json()

# #         if "product" in data:
# #             product = data["product"]
            
# #             # Extract relevant fields
# #             return {
# #                 "barcode": barcode,
# #                 "name": product.get("product_name", "Unknown"),
# #                 "brand": product.get("brands", "Not Available"),
# #                 "category": product.get("categories", "Unknown"),
# #                 "description": product.get("generic_name", "No description available"),
# #                 "image": product.get("image_url", None),  # Product Image
# #                 "nutrition": {
# #                     "energy": product.get("nutriments", {}).get("energy-kcal", "N/A"),
# #                     "fat": product.get("nutriments", {}).get("fat", "N/A"),
# #                     "saturated_fat": product.get("nutriments", {}).get("saturated-fat", "N/A"),
# #                     "carbohydrates": product.get("nutriments", {}).get("carbohydrates", "N/A"),
# #                     "sugars": product.get("nutriments", {}).get("sugars", "N/A"),
# #                     "fiber": product.get("nutriments", {}).get("fiber", "N/A"),
# #                     "salt": product.get("nutriments", {}).get("salt", "N/A"),
# #                     "proteins": product.get("nutriments", {}).get("proteins", "N/A"),
# #                 }
# #             }
# #     except requests.exceptions.RequestException as e:
# #         print(f"⚠️ API Error: {e}")
    
# #     return {"barcode": barcode, "error": "Product not found"}

# # # API to scan barcode from image
# # @app.post("/scan-barcode/")
# # async def scan_barcode(file: UploadFile = File(...)):
# #     try:
# #         image = Image.open(BytesIO(await file.read()))
# #         barcodes = decode(image)
        
# #         if not barcodes:
# #             return {"error": "No barcode found"}

# #         barcode_data = barcodes[0].data.decode("utf-8")
# #         return fetch_product(barcode_data)

# #     except Exception as e:
# #         return {"error": "Failed to process the image"}

# # # API to get product details by barcode
# # @app.get("/get-product/{barcode}")
# # async def get_product(barcode: str):
# #     return fetch_product(barcode)
# import requests
# from fastapi import FastAPI, File, UploadFile
# from pyzbar.pyzbar import decode
# from PIL import Image
# from io import BytesIO
# from fastapi.middleware.cors import CORSMiddleware
# import ollama

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

# # Fetch product details
# def fetch_product(barcode):
#     try:
#         response = requests.get(f"{OPENFOODFACTS_URL}/{barcode}.json", timeout=5)
#         response.raise_for_status()
#         data = response.json()

#         if "product" in data:
#             product = data["product"]
            
#             return {
#                 "barcode": barcode,
#                 "name": product.get("product_name", "Unknown"),
#                 "brand": product.get("brands", "Not Available"),
#                 "category": product.get("categories", "Unknown"),
#                 "description": product.get("generic_name", "No description available"),
#                 "image": product.get("image_url", None),
#                 "nutrition": {
#                     "energy": product.get("nutriments", {}).get("energy-kcal", "N/A"),
#                     "fat": product.get("nutriments", {}).get("fat", "N/A"),
#                     "saturated_fat": product.get("nutriments", {}).get("saturated-fat", "N/A"),
#                     "carbohydrates": product.get("nutriments", {}).get("carbohydrates", "N/A"),
#                     "sugars": product.get("nutriments", {}).get("sugars", "N/A"),
#                     "fiber": product.get("nutriments", {}).get("fiber", "N/A"),
#                     "salt": product.get("nutriments", {}).get("salt", "N/A"),
#                     "proteins": product.get("nutriments", {}).get("proteins", "N/A"),
#                 }
#             }
#     except requests.exceptions.RequestException as e:
#         print(f"⚠️ API Error: {e}")
    
#     return {"barcode": barcode, "error": "Product not found"}

# # Scan barcode
# @app.post("/scan-barcode/")
# async def scan_barcode(file: UploadFile = File(...)):
#     try:
#         image = Image.open(BytesIO(await file.read()))
#         barcodes = decode(image)
        
#         if not barcodes:
#             return {"error": "No barcode found"}

#         barcode_data = barcodes[0].data.decode("utf-8")
#         return fetch_product(barcode_data)

#     except Exception as e:
#         return {"error": "Failed to process the image"}

# # Get product details
# @app.get("/get-product/{barcode}")
# async def get_product(barcode: str):
#     return fetch_product(barcode)

# # Chatbot API
# @app.post("/chat")
# async def chat(data: dict):
#     user_message = data.get("text", "")
#     product_details = data.get("product", {})

#     # Context-aware prompt
#     context = f"The user is asking about {product_details.get('name', 'a product')}. "
#     context += f"Here are some details: {product_details}. " if product_details else ""
#     context += "Respond in a helpful and concise way."

#     try:
#         response = ollama.chat(
#             model="phi",
#             messages=[
#                 {"role": "system", "content": "You are a helpful AI assistant."},
#                 {"role": "user", "content": context + user_message},
#             ],
#         )

#         return {"response": response["message"]}
#     except Exception as e:
#         return {"response": "Error: Unable to process the request"}
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENFOODFACTS_URL = "https://world.openfoodfacts.org/api/v0/product"

# Fetch product details
def fetch_product(barcode: str):
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
        print(f"⚠ API Error: {e}")
    
    return {"barcode": barcode, "error": "Product not found"}

# Scan barcode
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

# Get product details
@app.get("/get-product/{barcode}")
async def get_product(barcode: str):
    return fetch_product(barcode)

# Define a function to format the chatbot response
def format_response_to_bullets(response_text: str) -> str:
    sentences = response_text.split(". ")
    bullet_points = [f"- {sentence.strip()}" for sentence in sentences if sentence.strip()]
    formatted_response = "\n".join(bullet_points)
    return formatted_response

# Chatbot API
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

        # Format the chatbot's response into bullet points
        formatted_response = format_response_to_bullets(response["message"]["content"])
        return {"response": formatted_response}

    except Exception as e:
        return {"response": "Error: Unable to process the request"}
