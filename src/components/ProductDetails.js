// import React from "react";
// import { useLocation } from "react-router-dom";
// import './ProductDetails.css';

// const ProductDetails = () => {
//     const location = useLocation();
//     const product = location.state?.product || null;

//     if (!product) {
//         return <h2 className="product-details-container">No product details available.</h2>;
//     }

//     return (
//         <div className="product-details-container">
//             <h2>Product Details</h2>
//             <h3>{product.name || "Unknown"}</h3>
//             <p><strong>Brand:</strong> {product.brand || "Not Available"}</p>
//             <p><strong>Category:</strong> {product.category || "Not Available"}</p>
//             <p><strong>Description:</strong> {product.description || "No description available"}</p>

//             {product.image && <img src={product.image} alt="Product" className="product-image" />}

//             <h3>🧪 Nutrition Facts</h3>
//             {product.nutrition ? (
//                 <div className="nutrition-facts">
//                     <ul>
//                         <li>Energy: {product.nutrition.energy || "N/A"} kcal</li>
//                         <li>Fat: {product.nutrition.fat || "N/A"} g</li>
//                         <li>Saturated Fat: {product.nutrition.saturated_fat || "N/A"} g</li>
//                         <li>Carbohydrates: {product.nutrition.carbohydrates || "N/A"} g</li>
//                         <li>Sugars: {product.nutrition.sugars || "N/A"} g</li>
//                         <li>Fiber: {product.nutrition.fiber || "N/A"} g</li>
//                         <li>Salt: {product.nutrition.salt || "N/A"} g</li>
//                         <li>Proteins: {product.nutrition.proteins || "N/A"} g</li>
//                     </ul>
//                 </div>
//             ) : (
//                 <p>No nutrition information available.</p>
//             )}
//         </div>
//     );
// };

// export default ProductDetails;
import React from "react";
import { useLocation } from "react-router-dom";
import Chatbot from "./Chatbot"; // Import chatbot
import './ProductDetails.css';

const ProductDetails = () => {
    const location = useLocation();
    const product = location.state?.product || null;

    if (!product) {
        return <h2 className="product-details-container">No product details available.</h2>;
    }

    return (
        <div className="product-details-container">
            <h2>Product Details</h2>
            <h3>{product.name || "Unknown"}</h3>
            <p><strong>Brand:</strong> {product.brand || "Not Available"}</p>
            <p><strong>Category:</strong> {product.category || "Not Available"}</p>
            <p><strong>Description:</strong> {product.description || "No description available"}</p>

            {product.image && <img src={product.image} alt="Product" className="product-image" />}

            <h3>🧪 Nutrition Facts</h3>
            {product.nutrition ? (
                <div className="nutrition-facts">
                    <ul>
                        <li>Energy: {product.nutrition.energy || "N/A"} kcal</li>
                        <li>Fat: {product.nutrition.fat || "N/A"} g</li>
                        <li>Saturated Fat: {product.nutrition.saturated_fat || "N/A"} g</li>
                        <li>Carbohydrates: {product.nutrition.carbohydrates || "N/A"} g</li>
                        <li>Sugars: {product.nutrition.sugars || "N/A"} g</li>
                        <li>Fiber: {product.nutrition.fiber || "N/A"} g</li>
                        <li>Salt: {product.nutrition.salt || "N/A"} g</li>
                        <li>Proteins: {product.nutrition.proteins || "N/A"} g</li>
                    </ul>
                </div>
            ) : (
                <p>No nutrition information available.</p>
            )}

            {/* Chatbot Component */}
            <Chatbot product={product} />
        </div>
    );
};

export default ProductDetails;
