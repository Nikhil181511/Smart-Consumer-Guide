import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Recommend.css';

const NutritionRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, product } = location.state || {};
  const [alternativeProducts, setAlternativeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlternatives = async () => {
      if (!product || !profile) {
        setError('Product or profile data is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/recommend-personalized/${product.barcode}`
        );

        setAlternativeProducts(response.data.alternatives || []);
      } catch (error) {
        console.error('Error fetching alternative products:', error);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, [profile, product]);

  if (!profile || !product) return <p>Invalid product or profile data.</p>;

  return (
    <div className="recommendations-container">
      <h1>🥗 Personalized Nutrition Recommendations</h1>

      {loading ? (
        <p>🔍 Searching for healthier alternatives...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="recommendations-content">
          <h2>For Product: {product.name || 'Unknown'}</h2>
          <p><strong>Category:</strong> {product.category || 'N/A'}</p>

          <div className="alternative-products">
            <h3>🥦 Recommended Alternatives</h3>
            {alternativeProducts.length > 0 ? (
              alternativeProducts.map((alt) => (
                <div key={alt.id} className="product-card">
                  <img
                    src={alt.image || '/default-product.png'}
                    alt={alt.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{alt.name}</h4>
                    <p><strong>Benefits:</strong> {alt.benefits.join(', ')}</p>
                    <p><strong>Ingredients:</strong> {alt.ingredients || 'N/A'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No suitable alternatives found.</p>
            )}
          </div>
        </div>
      )}

      <div className="back-btn">
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    </div>
  );
};

export default NutritionRecommendations;
