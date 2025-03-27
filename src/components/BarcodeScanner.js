import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import ProductDetails from "./ProductDetails";
import "../App.css";

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [scanMode, setScanMode] = useState("live"); // 'live' or 'upload'
  const [productData, setProductData] = useState(null);

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
      const formData = new FormData();
      formData.append("file", dataURItoBlob(imageData));

      const response = await fetch("http://localhost:8000/scan-barcode/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setProductData(result); // Store product details
    } catch (error) {
      console.error("Error processing barcode:", error);
    }
  };

  // Convert Data URL to Blob
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

      {/* Button to view product details */}
      {productData && (
        <button className="view-details-btn" onClick={() => setScanMode("details")}>
          View Product Details
        </button>
      )}

      {scanMode === "details" && <ProductDetails product={productData} />}
    </div>
  );
};

export default BarcodeScanner;
