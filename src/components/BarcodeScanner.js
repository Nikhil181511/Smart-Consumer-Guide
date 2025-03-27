import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { 
    QrCode, 
    Camera, 
    Upload, 
    Loader2 
} from "lucide-react";
import "./BarcodeScanner.css";

const BarcodeScanner = () => {
    const [loading, setLoading] = useState(false);
    const [welcomeVisible, setWelcomeVisible] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(false); // Track camera state
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Auto-dismiss welcome screen
    useEffect(() => {
        const timer = setTimeout(() => {
            setWelcomeVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Capture Image from Webcam
    const captureImage = async () => {
        try {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                const blob = await fetch(imageSrc).then(res => res.blob());
                await processImage(blob);
            }
        } catch (error) {
            console.error("Error capturing image:", error);
            alert("Failed to capture image. Please try again.");
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
        if (loading) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const response = await fetch("http://localhost:8000/scan-barcode/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data.error) {
                throw new Error(data.error);
            } 

            navigate("/product-details", { state: { product: data } });

        } catch (error) {
            console.error("Error processing barcode:", error);
            alert(error.message || "Error processing barcode. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container"> {/* Centering the component */}
            <div className="barcode-scanner">
                {welcomeVisible && (
                    <div className="welcome-overlay">
                        <div className="welcome-content">
                            <QrCode className="welcome-icon" size={64} />
                            <h1 className="welcome-title">
                                Product Scanner
                            </h1>
                            <p className="welcome-subtitle">
                                Scan. Discover. Explore.
                            </p>
                        </div>
                    </div>
                )}

                <h2>
                    <QrCode size={24} /> Barcode Scanner
                </h2>

                {/* Webcam Preview */}
                {isCameraOn && (
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        height="auto"
                        videoConstraints={{
                            width: 1280,
                            height: 720,
                            facingMode: "environment"
                        }}
                    />
                )}

                <div className="action-buttons">
                    {/* Capture Button */}
                    <button 
                        onClick={captureImage} 
                        disabled={loading}
                        className="capture-btn"
                    >
                        <Camera size={20} /> Capture
                    </button>

                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden-input"
                        disabled={loading}
                    />

                    {/* Upload Button */}
                    <button 
                        onClick={triggerFileInput}
                        disabled={loading}
                        className="upload-btn"
                    >
                        <Upload size={20} /> Upload
                    </button>

                    {/* Toggle Camera Button */}
                    <button
                        onClick={() => setIsCameraOn(prev => !prev)}
                        className="toggle-camera-btn"
                        disabled={loading}
                    >
                        {isCameraOn ? "Turn off Camera" : "Turn on Camera"}
                    </button>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="loading-overlay">
                        <Loader2 size={48} className="loading-spinner" />
                        <p>Processing...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;
