# 🛒 Smart Consumer Guide

## *🌟 Overview*  
The *AI-Powered Barcode Scanner & Chatbot* is a web application designed to enhance consumer awareness and decision-making. By leveraging *AI and barcode scanning technology, users can scan product barcodes, retrieve **detailed product information, and interact with an **AI-powered chatbot* for further insights.  

This project is particularly useful for *health-conscious consumers, **shoppers looking for specific product details, or **anyone wanting instant access to nutritional information* before purchasing a product.  


## 🏆 Team Name
Night Owls

## 👥 Team Members
1. *Jonathan Raposo*  
   📞 Contact:8767227381 
   📧 Email: jnthnraposo@gmail.com 
   *Contribution:* AI Chatbot + integration with project

2. *Sakshi Kamble*  
   📞 Contact: 9922701120 
   📧 Email:sakshikamble0506@gmail.com 
   *Contribution:* ProductDetails+ Frontend

3. *Nikhil Savita*  
   📞 Contact: 8149745685 
   📧 Email: nikhilsavita181511@gmail.com 
   *Contribution:* Barcode Scanner + Backend

## 📂 Project Structure

📦 SMART-CONSUMER-GUIDE3
├── 📁 src                # Source code for the project
│   ├── 📁 components     # React components
│   │   ├── BarcodeScanner.js
│   │   ├── Chatbot.js
│   │   ├── ProductDetails.js
│   │   ├── BarcodeScanner.css
│   │   ├── Chatbot.js
│   │   ├── ProductDetails.css
│   │   ├── HealthRating.js
│   ├── App.js           # Main application logic
│   ├── index.js         # Entry point
│   ├── App.css          # Main styles
│   ├── index.css        # Additional styles
├── main.py              # Backend logic
├── package.json         # Frontend dependencies
├── package-lock.json    # Dependency lock file
├── README.md            # Project documentation
└── .gitignore           # Files to ignore in version control


## 🛠 Tech Stack
- *Frontend:* React, CSS
- *Backend:* FastAPI, Python
- *AI Model:* Ollama -phi
- *Database/API:* OpenFoodFacts API

## 🔍 Approach
Our solution integrates a barcode scanner and an AI chatbot to enhance product information accessibility. The approach includes:
1. *Barcode Scanning:* Capturing barcodes using a webcam or image upload.
2. *Data Retrieval:* Fetching nutritional details and product images from OpenFoodFacts.
3. *AI Chatbot:* Enabling users to ask queries regarding scanned products using the Ollama model.
4. *User Experience:* Providing real-time responses for a seamless interaction.

## *📌 Project Workflow*  
1. 📷 *User scans a barcode* using their webcam or uploads an image.  
2. 📡 *The barcode is processed*, and product details are fetched from the OpenFoodFacts API.  
3. 📝 *Product details (name, brand, ingredients, nutrition, etc.)* are displayed.  
4. 🤖 *AI chatbot assists* with further queries related to the product.  
5. ✅ *Users receive detailed insights* to make informed purchasing decisions.  

## *🌟 Key Features*  
✔ *Barcode Scanner* – Capture product barcodes in real-time.  
✔ *Product Info Fetching* – Get data from OpenFoodFacts.  
✔ *AI-Powered Chatbot* – Ask questions and get instant AI responses.  
✔ *Seamless Integration* – Combines scanning, AI, and product data in one app.  
✔ *User-Friendly Interface* – Built with React for a smooth experience.  

🌟 Nutrition Preferences Component Overview

The Nutrition Preferences Component allows users to personalize their nutritional preferences, dietary restrictions, and health goals. It ensures that product recommendations align with the user's health needs.

📈 How It Works:
Users select their preferences – Dietary choices (vegetarian, vegan, gluten-free, etc.), allergies, and health goals (weight loss, muscle gain, etc.).
Data is stored in a state – The component manages user selections dynamically using React’s useState.
Users submit their choices – Upon clicking submit, preferences are passed along with product details for personalized recommendations.
Redirects to a results page – The app navigates users to a new page where tailored recommendations are displayed.

## 🚀 Installation & Setup
### ⿡ Backend Setup
sh
pip install -r requirements.txt
uvicorn main:app --reload


### ⿢ Frontend Setup
sh
npm install
npm start

## Demo Viedo 
Link :https://drive.google.com/file/d/1GA9P_lkij1Dz2K72SxXi1ICnaJD4-KwM/view?usp=sharing
---
