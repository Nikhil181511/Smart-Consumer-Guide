import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NutritionPreferences.css';

export const NutritionPreferences = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  useEffect(() => {
    if (!product) {
      console.warn('No product data found, redirecting...');
      navigate('/');
    }
  }, [product, navigate]);

  const [nutritionProfile, setNutritionProfile] = useState({
    dietaryPreferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      lowCarb: false,
      keto: false
    },
    allergies: {
      nuts: false,
      shellfish: false,
      eggs: false,
      soy: false,
      wheat: false,
      milk: false
    },
    healthGoals: {
      weightLoss: false,
      muscleGain: false,
      heartHealth: false,
      diabetesFriendly: false,
      energyBoost: false
    }
  });

  const handlePreferenceChange = (type, key) => {
    setNutritionProfile((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key]
      }
    }));
  };

  const handleSubmit = () => {
    if (!product) {
      console.error('No product data found.');
      return;
    }

    navigate('/nutrition-recommendations', {
      state: {
        profile: nutritionProfile,
        product: product
      }
    });
  };

  const renderCheckboxGroup = (groupName, stateKey) => (
    <div className="preferences-group">
      <h3>{groupName}</h3>
      {Object.keys(nutritionProfile[stateKey]).map((key) => (
        <div key={key} className="checkbox-item">
          <input
            type="checkbox"
            id={key}
            checked={nutritionProfile[stateKey][key]}
            onChange={() => handlePreferenceChange(stateKey, key)}
          />
          <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="nutrition-container">
      <div className="nutrition-content">
        <h1 className="title"> Personalize Your Nutrition Profile</h1>

        <div className="preferences-container">
          {renderCheckboxGroup('Dietary Preferences', 'dietaryPreferences')}
          {renderCheckboxGroup('Allergies', 'allergies')}
          {renderCheckboxGroup('Health Goals', 'healthGoals')}
        </div>

        <div className="submit-container">
          <button className="submit-btn" onClick={handleSubmit}>
            Generate Personalized Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionPreferences;
