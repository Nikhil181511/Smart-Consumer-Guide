import React from "react";
import "../App.css";

const ProductDetails = ({ product }) => {
  if (!product) return <p>No product data available</p>;

  return (
    <div className="product-details">
      <h2>📦 Product Details</h2>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <h3>📊 Nutritional Information</h3>
      <ul>
        {product.nutrition && Object.entries(product.nutrition).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetails;
