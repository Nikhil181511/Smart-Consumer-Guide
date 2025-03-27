import React from "react";

const ProductDetails = ({ product }) => {
    if (!product || product.error) return <p>No product found.</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>

            {/* Display Product Image */}
            {product.image && <img src={product.image} alt={product.name} width="200" />}

            <h3>🧪 Nutrition Facts</h3>
            <ul>
                <li><strong>Energy:</strong> {product.nutrition.energy} kcal</li>
                <li><strong>Fat:</strong> {product.nutrition.fat} g</li>
                <li><strong>Saturated Fat:</strong> {product.nutrition.saturated_fat} g</li>
                <li><strong>Carbohydrates:</strong> {product.nutrition.carbohydrates} g</li>
                <li><strong>Sugars:</strong> {product.nutrition.sugars} g</li>
                <li><strong>Fiber:</strong> {product.nutrition.fiber} g</li>
                <li><strong>Salt:</strong> {product.nutrition.salt} g</li>
                <li><strong>Proteins:</strong> {product.nutrition.proteins} g</li>
            </ul>
        </div>
    );
};

export default ProductDetails;
