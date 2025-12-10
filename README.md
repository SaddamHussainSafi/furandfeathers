# 🐾 Fur & Feathers — Full‑Stack Pet Adoption Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

**Fur & Feathers** is a next-generation pet adoption platform that bridges the gap between shelters and adopters through technology. By leveraging **AI-powered pet recognition**, **real-time messaging**, and a **seamless user experience**, we make finding a forever friend easier than ever.

---

## 📖 Table of Contents

*   [🌟 Key Features](#-key-features)
*   [📸 Visual Tour](#-visual-tour)
*   [🛠️ Tech Stack Deep Dive](#-tech-stack-deep-dive)
*   [🏗️ System Architecture](#-system-architecture)
*   [🚀 Comprehensive Setup Guide](#-comprehensive-setup-guide)
*   [⚙️ Configuration & Environment](#-configuration--environment)
*   [🔌 API Reference](#-api-reference)
*   [📂 Project Structure](#-project-structure)
*   [🤝 Contributing](#-contributing)

---

## 🌟 Key Features

### 🧠 AI-Powered Discovery
Upload a photo of a pet you love, and our **Google Gemini-powered AI** will analyze the breed, color, and features to find similar adoptable pets in our database. It's like Shazam for pets!

### 💬 Real-Time Communication
Built-in chat functionality allows adopters to ask questions directly to shelters without leaving the platform.
*   **Adopters**: Inquire about pet personality, health, and history.
*   **Shelters**: Manage inquiries efficiently and schedule visits.

### 🔐 Role-Based Access Control (RBAC)
A secure environment tailored to every user type:
<details>
<summary><strong>🐶 Adopter Experience</strong></summary>

*   **Smart Search**: Filter by breed, age, size, and temperament.
*   **Favorites & Watchlist**: Save pets to review later.
*   **Application Tracking**: Real-time status updates on adoption requests.
</details>

<details>
<summary><strong>🏠 Shelter Dashboard</strong></summary>

*   **Inventory Management**: CRUD operations for pet listings with rich media support.
*   **Application Workflow**: Review, approve, or reject applications with one click.
*   **Analytics**: Visualize profile views and application trends.
</details>

<details>
<summary><strong>🛡️ Admin Control Center</strong></summary>

*   **User Oversight**: Manage shelter verifications and user bans.
*   **Platform Health**: Monitor system-wide statistics and activity logs.
</details>

---

## 📸 Visual Tour

> **Note**: Drop your screenshots into `backend/uploads/screenshots/` with the filenames below to see them here.

### 🏠 Core Experience
| | |
|:---:|:---:|
| ![Home](backend/uploads/screenshots/homepage.png)<br>**Homepage**<br>Immersive landing with video background. | ![Login](backend/uploads/screenshots/login.png)<br>**Authentication**<br>Secure login with JWT & Google OAuth. |
| ![Profile](backend/uploads/screenshots/my-profile.png)<br>**User Profile**<br>Manage settings and favorites. | ![Messages](backend/uploads/screenshots/message-system.png)<br>**Messaging System**<br>Direct communication. |

### 🐾 Pet Discovery
| | |
|:---:|:---:|
| ![Pets](backend/uploads/screenshots/available-pets.png)<br>**Available Pets**<br>Browse all adoptable friends. | ![Featured](backend/uploads/screenshots/featured-pets.png)<br>**Featured Pets**<br>Highlighted pets looking for homes. |
| ![Details](backend/uploads/screenshots/pet-details.png)<br>**Pet Details**<br>Comprehensive info and stats. | ![Related](backend/uploads/screenshots/related-pets.png)<br>**Related Pets**<br>Smart suggestions based on viewing history. |
| ![Recs](backend/uploads/screenshots/pet-recommendation.png)<br>**Recommendations**<br>Personalized matches. | ![Playful](backend/uploads/screenshots/playful-content.png)<br>**Playful Content**<br>Engaging UI elements. |

### 🧠 AI Features
| | |
|:---:|:---:|
| ![AI Detect](backend/uploads/screenshots/pet-detection.png)<br>**AI Pet Detection**<br>Upload a photo to find lookalikes. | ![AI Chat](backend/uploads/screenshots/ai-chat.png)<br>**AI Chat Assistant**<br>Get instant answers about pets. |

### 🛡️ Shelter & Admin Management
| | |
|:---:|:---:|
| ![Dashboard](backend/uploads/screenshots/dashboard.png)<br>**Dashboard**<br>Overview of platform metrics. | ![Management](backend/uploads/screenshots/pet-management.png)<br>**Pet Management**<br>Inventory control center. |
| ![Add 1](backend/uploads/screenshots/petadding-1.png)<br>**Add Pet (Step 1)**<br>Basic information entry. | ![Add 2](backend/uploads/screenshots/pet-adding-2.png)<br>**Add Pet (Step 2)**<br>Detailed attributes. |
| ![Approvals](backend/uploads/screenshots/pet-approvals.png)<br>**Pet Approvals**<br>Admin review workflow. | ![Users](backend/uploads/screenshots/user-management.png)<br>**User Management**<br>Administer user roles. |

---

## 🛠️ Tech Stack Deep Dive

### **Frontend (Client-Side)**
*   **React 18**: Component-based UI architecture.
*   **Vite**: Lightning-fast build tool and dev server.
*   **Tailwind CSS**: Utility-first styling for rapid design implementation.
*   **Framer Motion & GSAP**: Smooth, complex animations for a polished feel.
*   **Axios**: Promise-based HTTP client with interceptors for JWT handling.
*   **Context API**: Global state management for Authentication and Theme.

### **Backend (Server-Side)**
*   **Spring Boot 3**: Production-ready Java framework.
*   **Spring Security**: Robust authentication and authorization.
*   **Spring Data JPA**: Abstraction over Hibernate for database interactions.
*   **Google Gemini API**: Multimodal AI for image analysis.
*   **Lombok**: Reduces boilerplate code (Getters, Setters, Builders).

### **Database**
*   **MySQL 8.0**: Relational database for structured data (Users, Pets, Applications).

---

## 🏗️ System Architecture

The application follows a **Monolithic Architecture** with clear separation of concerns, designed to be easily split into microservices if needed.

```mermaid
graph TD
    subgraph Client
        Browser[React SPA]
    end

    subgraph Server
        Controller[REST Controllers]
        Service[Business Logic Layer]
        Repo[JPA Repositories]
        Security[Spring Security Filter Chain]
    end

    subgraph Infrastructure
        DB[(MySQL Database)]
        FS[File System /uploads]
    end

    subgraph External Services
        GoogleAuth[Google OAuth2]
        GeminiAI[Google Gemini API]
    end

    Browser -->|JSON/HTTPS| Security
    Security --> Controller
    Controller --> Service
    Service --> Repo
    Service -->|Image Analysis| GeminiAI
    Repo --> DB
    Service -->|Store Images| FS
    Browser -->|Auth Token| GoogleAuth
```

---

## 🔄 User Journey & Workflow

The platform facilitates a seamless journey from initial signup to finalizing an adoption.

```mermaid
sequenceDiagram
    autonumber
    actor User as Adopter
    actor Shelter
    participant FE as Frontend
    participant BE as Backend
    participant AI as Gemini AI
    participant DB as Database

    %% Onboarding Phase
    Note over User, DB: 🟢 Onboarding Phase
    User->>FE: Sign Up / Login
    FE->>BE: Auth Request (JWT/OAuth)
    BE->>DB: Verify/Create User
    BE-->>FE: Return JWT Token

    %% Pet Management Phase
    Note over Shelter, DB: 🟠 Pet Management Phase
    Shelter->>FE: Upload Pet Photo
    FE->>BE: Send Image
    BE->>AI: Analyze Image (Breed/Traits)
    AI-->>BE: Return Analysis
    BE-->>FE: Auto-fill Pet Details
    Shelter->>FE: Confirm & Publish
    FE->>BE: Save Pet Data
    BE->>DB: Persist Pet Record

    %% Discovery & Adoption Phase
    Note over User, DB: 🔵 Discovery & Adoption Phase
    User->>FE: Browse / Upload Photo Search
    FE->>BE: Search Query / Image
    BE->>DB: Query Pets
    BE-->>FE: Return Matches
    User->>FE: View Details & Chat
    FE->>BE: Send Message
    Shelter->>FE: Receive Message
    User->>FE: Submit Application
    FE->>BE: Create Application
    Shelter->>FE: Review & Approve
    FE->>BE: Update Status
    BE->>DB: Mark Adopted
```

---

## 🚀 Comprehensive Setup Guide

### Prerequisites
Ensure you have the following installed:
*   **Java Development Kit (JDK) 17+**
*   **Node.js 18+** & **npm**
*   **MySQL Server 8.0+**
*   **Git**

### 1. Clone & Prepare
```bash
git clone https://github.com/yourusername/furandfeathers.git
cd furandfeathers
```

### 2. Database Configuration
Log in to your MySQL shell and create the database:
```sql
CREATE DATABASE testtt;
-- Ensure your user has privileges
GRANT ALL PRIVILEGES ON testtt.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Configuration
Navigate to `backend/src/main/resources/application.properties` and configure:

| Property | Description | Example Value |
| :--- | :--- | :--- |
| `spring.datasource.username` | DB Username | `root` |
| `spring.datasource.password` | DB Password | `password123` |
| `google.client.id` | Google OAuth Client ID | `12345...apps.googleusercontent.com` |
| `google.api.key` | Gemini AI API Key | `AIzaSy...` |
| `app.jwt.secret` | JWT Signing Key | `super_secret_key_at_least_32_chars` |

### 4. Launch Backend
```bash
cd backend
# Windows
.\mvnw.cmd spring-boot:run
# Mac/Linux
./mvnw spring-boot:run
```
*Server will start on `http://localhost:8080`*

### 5. Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_BASE_URL=http://localhost:8080
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 6. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
*App will open at `http://localhost:5173`*

---

## 🔌 API Reference

Here are the primary endpoints used by the application.

### **Authentication**
*   `POST /api/auth/register` - Register a new user (Adopter/Shelter).
*   `POST /api/auth/login` - Authenticate and receive JWT.
*   `POST /api/auth/google` - Login with Google OAuth.

### **Pets**
*   `GET /api/pets` - Retrieve paginated list of pets.
*   `GET /api/pets/{id}` - Get detailed pet profile.
*   `POST /api/pets` - (Shelter) Create a new pet listing.
*   `PUT /api/pets/{id}` - (Shelter) Update pet details.
*   `DELETE /api/pets/{id}` - (Shelter) Remove a listing.

### **Applications**
*   `POST /api/applications` - Submit an adoption request.
*   `GET /api/applications/user/{userId}` - Get user's application history.
*   `PUT /api/applications/{id}/status` - (Shelter) Approve/Reject application.

### **AI Services**
*   `POST /api/ai/analyze` - Upload image for breed/feature detection.

---

## 📂 Project Structure

A quick look at the top-level directory structure:

```
furandfeathers/
├── backend/
│   ├── src/main/java/com/furandfeathers/
│   │   ├── config/          # Security & App Config
│   │   ├── controller/      # REST API Endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities (DB Tables)
│   │   ├── repository/      # DB Access Layer
│   │   └── service/         # Business Logic
│   └── uploads/             # Local storage for images
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios setup & endpoints
│   │   ├── components/      # Reusable UI Components
│   │   ├── context/         # AuthContext & Global State
│   │   ├── hooks/           # Custom React Hooks
│   │   └── pages/           # Full Page Views
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  **Fork** the repository.
2.  Create a **Feature Branch** (`git checkout -b feature/NewFeature`).
3.  **Commit** your changes (`git commit -m 'Add some NewFeature'`).
4.  **Push** to the branch (`git push origin feature/NewFeature`).
5.  Open a **Pull Request**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

