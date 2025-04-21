# 🧬 Diagnosis Support System

A full-stack web application to **analyze, annotate, and diagnose Pap smear images** using deep learning. Combines interactive image editing tools, patient data management, and AI-powered object detection.

---

## 🌐 Features

### 🔐 Authentication
- User login system to protect sensitive patient data
- **All API endpoints are secured using JWT tokens**

### 🖼 Interactive Image Canvas
- Upload images (e.g., Pap smear slides)
- Draw on images using a customizable brush
- Zoom in/out for detailed inspection
- Delete previous annotations

### 🤖 AI-Assisted Diagnosis
- Uses a **YOLO-based model** for object detection
- Detects medical features in Pap smear images:
  - **Koilocytes**
  - **HSIL** (High-grade Squamous Intraepithelial Lesion)
  - **LSIL** (Low-grade Squamous Intraepithelial Lesion)

### 📝 Patient Data Input
- Input fields for:
  - **Name**
  - **Surname**
  - **Age**
  - **Description** for the uploaded image
- Save both image and metadata to a secure database

### 🔎 Image & Record Browser
- Search through uploaded images
- View:
  - Annotated images
  - Associated descriptions
    
### 🔄 Custom Model Upload
- Upload your own object detection model
- Custom models must follow a predefined output format 

---

## 🏗 Tech Stack

### 🧠 AI Model (Backend)
- **Python Flask**
  - Hosts the trained YOLO model
  - Handles image inference and returns predictions

### 🔧 Server-Side
- **Java Spring Boot**
  - Manages user authentication, JWT authorization, data persistence, and API endpoints

### 🖥 Frontend
- **React.js**
  - Interactive canvas with brush, zoom, and erase tools
  - Upload and preview images
  - Form input for patient data
  - Page for browsing previously saved cases
![image](https://github.com/user-attachments/assets/aedcb50e-0e94-47b4-bef8-618c84f3f119)

---
