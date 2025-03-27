import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;  // Get product from state

  if (!product) {
    return (
      <div className="product-details">
        <h2>No Product Details Found</h2>
        <button onClick={() => navigate("/")}>🔙 Back to Scanner</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <h2>📦 Product Details</h2>
      {product.image && <img src={product.image} alt={product.name} className="product-image" />}
      <p><strong>Name:</strong> {product.name || "Unknown"}</p>
      <p><strong>Brand:</strong> {product.brand || "Not Available"}</p>
      <p><strong>Category:</strong> {product.category || "Unknown"}</p>
      <p><strong>Description:</strong> {product.description || "No description available"}</p>

      {/* Display Nutrition Information */}
      {product.nutrition && (
        <div className="nutrition-section">
          <h3>🥗 Nutrition Facts</h3>
          <table>
            <tbody>
              {Object.entries(product.nutrition).map(([key, value]) => (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => navigate("/")}>🔙 Back to Scanner</button>
    </div>
  );
};

export default ProductDetails;
