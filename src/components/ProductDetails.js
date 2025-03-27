import React from "react";
import "../App.css"; // Ensure this path is correct

const ProductDetails = ({ product }) => {
  if (!product || product.error) {
    return <div className="error">⚠️ No product data available</div>;
  }

  return (
    <div className="product-container">
      <h2>📦 Product Details</h2>
      <p><strong>Barcode:</strong> {product.barcode}</p>
      <p><strong>Name:</strong> {product.name || "Not Available"}</p>
      <p><strong>Brand:</strong> {product.brand || "Unknown"}</p>
      <p><strong>Category:</strong> {product.category || "N/A"}</p>
      <p><strong>Description:</strong> {product.description || "Not Available"}</p>

      {product.image && <img src={product.image} alt="Product" className="product-image" />}

      <h3>🥗 Nutrition Informaton</h3>
      {product.nutrition ? (
        <table className="nutrition-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Value</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(product.nutrition).map(([key, value]) => (
              <tr key={key}>
                <td>{key.replace(/_/g, " ")}</td>
                <td>{typeof value === "object" ? value.value : value}</td>
                <td>{value.unit || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No nutrition data available</p>
      )}
    </div>
  );
};

export default ProductDetails;
