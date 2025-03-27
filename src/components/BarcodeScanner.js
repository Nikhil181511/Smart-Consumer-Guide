import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./BarcodeScanner.css";

const BarcodeScanner = () => {
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    // Capture Image from Webcam
    const captureImage = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob = await fetch(imageSrc).then(res => res.blob());
            processImage(blob);
        }
    };

    // Handle File Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            processImage(file);
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
            console.log("API Response:", data); // ✅ Debugging: Check API response

            if (data.error) {
                alert("Error: " + data.error);
            } else {
                // ✅ Corrected Navigation Syntax
                navigate("/product-details", { state: { product: data } });
            }
        } catch (error) {
            console.error("Error processing barcode:", error);
            alert("Error processing barcode. Please try again.");
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
            <button onClick={captureImage}>📷 Capture from Webcam</button>

            {/* File Upload */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            
            {loading && <p>Processing...</p>}
        </div>
    );
};

export default BarcodeScanner;
