import React, { useState } from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [product, setProduct] = useState(null);

  return (
    <div className="App">
      <h1>🔍 Smart Barcode Scanner</h1>
      <BarcodeScanner onBarcodeDetected={setProduct} />
      {product && <ProductDetails product={product} />}
    </div>
  );
}

export default App;
