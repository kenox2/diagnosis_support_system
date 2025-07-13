---
# 🧬 Diagnosis Support System

A learning project: a full-stack, containerized web app that leverages deep learning to **analyze, annotate, and diagnose Pap smear images**. Built to explore ML integration, Docker workflows, and AWS deployment.

---

## 🌟 Project Highlights

- **End-to-End ML Exploration**
  - YOLO-based model served via a Python Flask microservice
  - Interactive React canvas for real‑time image annotation
- **Secure API Layer**
  - Java Spring Boot with JWT authentication
  - MySQL-backed data persistence
- **Containerized Workflow**
  - Three Docker images (frontend, Java backend, Python inference)
  - Local orchestration with Docker Compose

---

## 🌐 Features

### 🔐 Authentication
- User login system to protect sensitive patient data  
- **All API endpoints** secured using JWT tokens

### 🖼 Interactive Image Canvas
- Upload Pap smear slides  
- Draw, zoom, and annotate with a customizable brush  
- Remove annotations and adjust views for detailed inspection

### 🤖 AI-Assisted Diagnosis
- **YOLO-based object detection** for Koilocytes, HSIL, and LSIL  
- Real-time inference via Flask microservice

### 📝 Patient Data Management
- Capture **Name**, **Surname**, **Age**, and **Description**  
- Store images and metadata in a MySQL database

### 🔎 Browsing & Search
- Filter and search through saved cases  
- View annotated images alongside their metadata

### 🔄 Custom Model Upload
- Upload custom detection models following predefined output formats

---

## 🐳 Docker Overview

| Component         | Role                                           | Ports |
|-------------------|------------------------------------------------|-------|
| **Frontend**      | React app served by Nginx                      | 80    |
| **Java Backend**  | Spring Boot REST API (JWT, DB access)          | 8080  |
| **Python Backend**| Flask inference service for YOLO model         | 5001  |
| **Database**      | MySQL for user and image metadata              | 3306  |

### Docker Compose (local)

```yaml
version: "3.9"
services:
  db:
    image: mysql:9.3.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: inz
    volumes:
      - sys-db:/var/lib/mysql

  client-app:
    build: ./frontend
    ports:
      - "80:80"

  java-backend:
    build: ./backend/REST_API
    ports:
      - "8080:8080"
    environment:
      DB_HOST: db
      DB_USER: root
      DB_PASS: root
      PY_BACKEND: http://python-backend:5001

  python-backend:
    build: ./backend/model_API
    ports:
      - "5001:5001"

volumes:
  sys-db:
```

---

## 🚀 Deployment on AWS EC2

1. **Push Docker images** to a registry  
2. **Launch an EC2 instance** and install Docker & Docker Compose  
3. **Clone the repo** onto the EC2 host:
  ```bash
  git clone <your-repo-url>
  cd <project-root>
   ```  
5. **Modify environment variables** in docker-compose.yml and any Dockerfiles as needed to reflect your deployment settings (e.g., database credentials, backend URLs, secret keys).
   ```bash
   docker-compose up -d
   ```  
6. **Access the app** at `http://<EC2_PUBLIC_IP>/` and API at `http://<EC2_PUBLIC_IP>:8080/`

> For demo and learning purposes—**not production‑hardened**.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Nginx  
- **API:** Java Spring Boot, JWT, MySQL  
- **Inference:** Python Flask, YOLO, OpenAI CLIP  
- **Orchestration:** Docker, Docker Compose  
- **Cloud:** AWS EC2  

---
