import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const BarcodeScanner = ({ onBarcodeDetected }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [barcodeData, setBarcodeData] = useState(null);
    const webcamRef = useRef(null);

    // Handle File Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            processImage(file);
        }
    };

    // Capture Image from Webcam
    const captureImage = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob = await fetch(imageSrc).then(res => res.blob());
            processImage(blob);
        }
    };

    // Process Image & Send to Backend
    const processImage = async (imageFile) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const response = await fetch("http://localhost:8000/scan-barcode/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                setBarcodeData(data);
                onBarcodeDetected(data);  // Send data to parent component
            }
        } catch (error) {
            console.error("Error processing barcode:", error);
        }
        setLoading(false);
    };

    return (
        <div className="barcode-scanner">
            <h2>Scan Barcode</h2>

            {/* Webcam Preview */}
            <Webcam 
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                height="auto"
            />
            <button onClick={captureImage}>Capture from Webcam</button>

            {/* File Upload */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            
            {loading && <p>Processing...</p>}

            {barcodeData && (
                <div>
                    <h3>Name: {barcodeData.name || "Not Available"}</h3>
                    <p><strong>Brand:</strong> {barcodeData.brand || "Not Available"}</p>
                    <p><strong>Category:</strong> {barcodeData.category || "Not Available"}</p>
                    <p><strong>Description:</strong> {barcodeData.description || "No description available"}</p>

                    {/* Nutrition Facts */}
                    {barcodeData.nutrition ? (
                        <div>
                            <h3>🧪 Nutrition Facts</h3>
                            <p><strong>Energy:</strong> {barcodeData.nutrition.energy || "N/A"} kcal</p>
                            <p><strong>Fat:</strong> {barcodeData.nutrition.fat || "N/A"} g</p>
                            <p><strong>Saturated Fat:</strong> {barcodeData.nutrition.saturated_fat || "N/A"} g</p>
                            <p><strong>Carbohydrates:</strong> {barcodeData.nutrition.carbohydrates || "N/A"} g</p>
                            <p><strong>Sugars:</strong> {barcodeData.nutrition.sugars || "N/A"} g</p>
                            <p><strong>Fiber:</strong> {barcodeData.nutrition.fiber || "N/A"} g</p>
                            <p><strong>Salt:</strong> {barcodeData.nutrition.salt || "N/A"} g</p>
                            <p><strong>Proteins:</strong> {barcodeData.nutrition.proteins || "N/A"} g</p>
                        </div>
                    ) : (
                        <p>No nutrition information available.</p>
                    )}

                    {/* View Product Button */}
                    <button onClick={() => window.location.href = `/product-details?barcode=${barcodeData.barcode}`}>
                        View Product Details
                    </button>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
