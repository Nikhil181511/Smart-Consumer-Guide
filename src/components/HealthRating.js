import React, { useEffect, useState } from "react";

const API_KEY = "YOUR_USDA_API_KEY";

const HealthRating = ({ productName }) => {
  const [healthScore, setHealthScore] = useState(null);
  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    if (!productName) return;

    const fetchHealthData = async () => {
      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${productName}&api_key=${API_KEY}`
        );

        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
          const firstResult = data.foods[0];
          setHealthScore({
            calories: firstResult.foodNutrients.find(n => n.nutrientName === "Energy")?.value || "N/A",
            fat: firstResult.foodNutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || "N/A",
            protein: firstResult.foodNutrients.find(n => n.nutrientName === "Protein")?.value || "N/A",
          });

          setAlternatives(data.foods.slice(1, 4).map(food => food.description));
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchHealthData();
  }, [productName]);

  return (
    <div className="health-rating">
      <h3>🔍 Health Rating</h3>
      {healthScore ? (
        <div>
          <p><strong>Calories:</strong> {healthScore.calories} kcal</p>
          <p><strong>Fat:</strong> {healthScore.fat} g</p>
          <p><strong>Protein:</strong> {healthScore.protein} g</p>
        </div>
      ) : (
        <p>Loading health data...</p>
      )}

      <h3>🔄 Alternative Products</h3>
      <ul>
        {alternatives.length > 0 ? (
          alternatives.map((alt, index) => <li key={index}>{alt}</li>)
        ) : (
          <p>No alternatives found.</p>
        )}
      </ul>
    </div>
  );
};

export default HealthRating;
