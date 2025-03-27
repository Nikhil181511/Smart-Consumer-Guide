import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarcodeScanner from "./components/BarcodeScanner";
import ProductDetails from "./components/ProductDetails";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BarcodeScanner />} />
                <Route path="/product-details" element={<ProductDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
