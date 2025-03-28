import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { QrCode, Camera, Upload, Loader2 } from "lucide-react";
import "./BarcodeScanner.css";
import QrCodeIllustration from './image.png';

const BarcodeScanner = () => {
    const [loading, setLoading] = useState(false);
    const [welcomeVisible, setWelcomeVisible] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setWelcomeVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const captureImage = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob = await fetch(imageSrc).then(res => res.blob());
            await processImage(blob);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            processImage(file);
        }
    };

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

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            navigate("/product-details", { state: { product: data } });
        } catch (error) {
            console.error("Error processing barcode:", error);
            alert(error.message || "Error processing barcode. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Add this function to navigate to the community chat page
    const navigateToCommunityChat = () => {
        navigate("/community-chat");
    };

    return (
        <div className="container">
            {welcomeVisible && (
                <div className="welcome-overlay">
                    <div className="welcome-content">
                        <QrCode className="welcome-icon" size={64} />
                        <h1 className="welcome-title">Product Scanner</h1>
                        <p className="welcome-subtitle">Scan. Discover. Explore.</p>
                    </div>
                </div>
            )}

            <div className="scanner-header">
                <h2><QrCode size={44} /> Barcode Scanner</h2>
                <p className="subtitle">Today is a beautiful day</p>
            </div>

            {/* Horizontal Flex Container for Three Components */}
            <div className="horizontal-container">

                {/* QR Code Illustration */}
                <div className="scanner-illustration">
                    <img 
                        src={QrCodeIllustration} 
                        alt="Scan and Discover" 
                        className="illustration-image"
                    />
                </div>

                {/* Webcam Preview */}
                {isCameraOn && (
                    <div className="webcam-container">
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
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        onClick={captureImage} 
                        disabled={loading}
                        className="capture-btn"
                    >
                        <Camera size={20} /> Capture
                    </button>

                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden-input"
                        disabled={loading}
                    />

                    <button 
                        onClick={triggerFileInput}
                        disabled={loading}
                        className="upload-btn"
                    >
                        <Upload size={20} /> Upload
                    </button>

                    <button
                        onClick={() => setIsCameraOn(prev => !prev)}
                        className="toggle-camera-btn"
                        disabled={loading}
                    >
                        {isCameraOn ? "Turn off Camera" : "Turn on Camera"}
                    </button>

                    {/* Button to Navigate to Community Chat */}
                    <button 
                        onClick={navigateToCommunityChat} 
                        className="community-chat-btn"
                    >
                        Go to Community Chat
                    </button>
                </div>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <Loader2 size={48} className="loading-spinner" />
                    <p>Processing...</p>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
