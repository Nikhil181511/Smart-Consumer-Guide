import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";  
import "../App.css";

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();  
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [scanMode, setScanMode] = useState("live");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    processImage(imageSrc);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", dataURItoBlob(imageData));

      const response = await fetch("http://localhost:8000/scan-barcode/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setProductDetails(result);
    } catch (error) {
      console.error("Error processing barcode:", error);
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="scanner-container">
      <h2>📸 Scan Barcode</h2>
      <div className="scan-options">
        <button onClick={() => setScanMode("live")}>📷 Live Scan</button>
        <button onClick={() => setScanMode("upload")}>📂 Upload Image</button>
      </div>

      {scanMode === "live" && (
        <>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-view" />
          <button className="capture-btn" onClick={captureImage}>Capture</button>
        </>
      )}

      {scanMode === "upload" && (
        <div className="upload-section">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadImage && <img src={uploadImage} alt="Uploaded" className="preview-img" />}
        </div>
      )}

      {capturedImage && <img src={capturedImage} alt="Captured" className="preview-img" />}
      {loading && <p>⏳ Processing...</p>}

      {productDetails && !loading && (
        <button 
          className="view-product-btn" 
          onClick={() => navigate("/product-details", { state: { product: productDetails } })}
        >
          📄 View Product Details
        </button>
      )}
    </div>
  );
};

export default BarcodeScanner;
