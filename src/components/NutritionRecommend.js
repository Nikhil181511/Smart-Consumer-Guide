import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faSpinner, faExclamationCircle, faBox, faTag, faLeaf, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Recommend.css'; // Ensure this is included for styling

const NutritionRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, product } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealthInfo = async () => {
      if (!product || !profile) {
        setError('Product or profile data is missing.');
        setLoading(false);
        return;
      }

      try {
        // Simulating fetching health-related data based on profile and product
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching health info:', error);
        setError('Failed to fetch health information. Please try again later.');
        setLoading(false);
      }
    };

    fetchHealthInfo();
  }, [profile, product]);

  if (!profile || !product) return <p>Invalid product or profile data.</p>;

  return (
    <div className="recommendations-container">
      <h1>
        <FontAwesomeIcon icon={faAppleAlt} /> Personalized Nutrition Recommendations
      </h1>

      {loading ? (
        <p><FontAwesomeIcon icon={faSpinner} spin /> Searching for health insights...</p>
      ) : error ? (
        <p className="error-message"><FontAwesomeIcon icon={faExclamationCircle} /> {error}</p>
      ) : (
        <div className="recommendations-content">
          <h2>
            <FontAwesomeIcon icon={faBox} /> Alternative Products For Product: {product.name || 'Unknown'}
          </h2>
          <p><strong><FontAwesomeIcon icon={faTag} /> Category:</strong> {product.category || 'N/A'}</p>

          <div className="health-message">
            <h3><FontAwesomeIcon icon={faLeaf} /> Focus on Your Health</h3>
            <p>
              Eating a balanced and nutritious diet is crucial for maintaining good health. It can help you manage your weight, improve your energy levels, and reduce the risk of chronic diseases. Based on your preferences, make sure to select products that align with your health goals, such as heart health, muscle gain, or weight loss.
            </p>
            <p>
              Don't forget to always check for ingredients and nutritional facts to make informed decisions about your diet. It's important to choose alternatives that support your dietary needs and preferences.
            </p>
          </div>
        </div>
      )}

      <div className="back-btn">
        <button onClick={() => navigate('/')}><FontAwesomeIcon icon={faArrowLeft} /> Go Back</button>
      </div>
    </div>
  );
};

export default NutritionRecommendations;
