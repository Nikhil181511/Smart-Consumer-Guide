import { useState } from "react";
import '../App.css'; 
function BarcodeScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/scan-barcode/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Error scanning barcode." });
    }
  };

  return (
    <div>
      <h2>Upload Barcode Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Scan</button>

      {result && (
        <div>
          <h3>📦 Product Details</h3>
          {Object.keys(result).map((key) => (
            <p key={key}>
              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
              {typeof result[key] === "object" ? JSON.stringify(result[key], null, 2) : result[key] || "N/A"}
            </p>
          ))}

          {result.image && (
            <div>
              <h3>🖼️ Product Image</h3>
              <img src={result.image} alt="Product" width="150" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
