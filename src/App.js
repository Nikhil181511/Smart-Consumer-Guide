import React, { useState } from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import ProductDetails from "./components/ProductDetails";

const App = () => {
    const [product, setProduct] = useState(null);

    return (
        <div>
            <h1>📷 Barcode Scanner</h1>
            {!product ? (
                <BarcodeScanner onBarcodeDetected={setProduct} />
            ) : (
                <ProductDetails product={product} goBack={() => setProduct(null)} />
            )}
        </div>
    );
};

export default App;
