import React from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import './App.css'; 

function App() {
    return (
        <div>
            <h1>Smart Barcode Scanner</h1>
            <BarcodeScanner />
        </div>
    );
}

export default App;
