import React from "react";

const ProductDetails = ({ product, goBack }) => {
    return (
        <div>
            <h2>📦 Product Details</h2>
            <p><strong>Name:</strong> {product.name || "Not Available"}</p>
            <p><strong>Brand:</strong> {product.brand || "Not Available"}</p>
            <p><strong>Category:</strong> {product.category || "Not Available"}</p>
            <p><strong>Description:</strong> {product.description || "No description available"}</p>

            {product.image && <img src={product.image} alt={product.name} width="200" />}

            {product.nutrition && (
                <div>
                    <h3>🧪 Nutrition Facts</h3>
                    <p><strong>Energy:</strong> {product.nutrition["energy-kcal"] || "N/A"} kcal</p>
                    <p><strong>Fat:</strong> {product.nutrition["fat"] || "N/A"} g</p>
                    <p><strong>Saturated Fat:</strong> {product.nutrition["saturated-fat"] || "N/A"} g</p>
                    <p><strong>Carbohydrates:</strong> {product.nutrition["carbohydrates"] || "N/A"} g</p>
                    <p><strong>Sugars:</strong> {product.nutrition["sugars"] || "N/A"} g</p>
                    <p><strong>Fiber:</strong> {product.nutrition["fiber"] || "N/A"} g</p>
                    <p><strong>Salt:</strong> {product.nutrition["salt"] || "N/A"} g</p>
                    <p><strong>Proteins:</strong> {product.nutrition["proteins"] || "N/A"} g</p>
                </div>
            )}

            <button onClick={goBack}>🔙 Go Back</button>
        </div>
    );
};

export default ProductDetails;
