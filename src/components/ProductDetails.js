import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Chatbot from "./Chatbot"; // Import chatbot
import './ProductDetails.css';

const calculateNutritionScore = (nutrition) => {
  if (!nutrition) return 0;
  
  let score = 50; // Base score
  
  score += nutrition.proteins > 10 ? 10 : 0;
  score -= nutrition.sugars > 10 ? 10 : 0;
  score += nutrition.fiber > 3 ? 5 : 0;
  score -= nutrition.saturated_fat > 5 ? 10 : 0;
  
  return Math.min(Math.max(score, 0), 100);
};

const calculateEnvironmentalScore = (product) => {
  let score = 50;
  
  score += product.sustainablePackaging ? 15 : 0;
  score += product.localSourcing ? 10 : 0;
  score -= product.highCarbonFootprint ? 15 : 0;
  
  return Math.min(Math.max(score, 0), 100);
};

const calculateEthicalSourcingScore = (product) => {
  let score = 50;
  
  score += product.fairTrade ? 20 : 0;
  score += product.organicCertified ? 15 : 0;
  score += product.supportsCommunities ? 10 : 0;
  
  return Math.min(Math.max(score, 0), 100);
};

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const handlePersonalizeNutrition = () => {
    navigate('/nutrition-preferences', { 
      state: { 
        product: product 
      } 
    });
  };

  if (!product) {
    return <h2 className="product-details-container">No product details available.</h2>;
  }

  const nutritionScore = calculateNutritionScore(product.nutrition);
  const environmentalScore = calculateEnvironmentalScore(product);
  const ethicalSourcingScore = calculateEthicalSourcingScore(product);

  const scoreData = [
    { name: 'Nutrition', value: nutritionScore },
    { name: 'Environmental Impact', value: environmentalScore },
    { name: 'Ethical Sourcing', value: ethicalSourcingScore }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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

      <h3>🌍 AI-Driven Sustainability Scores</h3>
      <div className="sustainability-scores">
        <PieChart width={400} height={400}>
          <Pie
            data={scoreData}
            cx={200}
            cy={200}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {scoreData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <div className="score-details">
          {scoreData.map((score, index) => (
            <div key={score.name} className="score-detail-item">
              <div 
                className="score-color-indicator" 
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <div className="score-text">
                <strong>{score.name}</strong>
                <span>{score.value}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nutrition-personalization-section mt-6 text-center">
        <button 
          onClick={handlePersonalizeNutrition}
          className="nutrition-btn"
        >
          🍽 Personalize Nutrition Recommendations
        </button>
      </div>

      {/* Chatbot Component */}
      <Chatbot product={product} />
    </div>
  );
};

export default ProductDetails;
