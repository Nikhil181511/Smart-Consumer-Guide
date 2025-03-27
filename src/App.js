import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarcodeScanner from "./components/BarcodeScanner";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [barcode, setBarcode] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BarcodeScanner setBarcode={setBarcode} />} />
        <Route path="/product/:barcode" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
