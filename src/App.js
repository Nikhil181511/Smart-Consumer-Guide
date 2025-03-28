import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BarcodeScanner from "./components/BarcodeScanner";
import ProductDetails from "./components/ProductDetails";
import NutritionPreferences from "./components/NutritionPreferences";
import NutritionRecommendations from "./components/NutritionRecommend";
import CommunityChat from "./components/CommunityChat"; // Import the new CommunityChat component

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Scanner and Product Details */}
                <Route path="/" element={<BarcodeScanner />} />
                <Route path="/product-details" element={<ProductDetails />} />

                {/* Nutrition Preferences and Recommendations */}
                <Route path="/nutrition-preferences" element={<NutritionPreferences />} />
                <Route path="/nutrition-recommendations" element={<NutritionRecommendations />} />

                {/* Community Chat */}
                <Route path="/community-chat" element={<CommunityChat />} /> {/* New Route for Community Chat */}

                {/* Fallback for Undefined Routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
