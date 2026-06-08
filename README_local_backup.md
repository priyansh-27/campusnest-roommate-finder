# CampusNest – Student-First Living Platform 🚀

A modern, full-stack housing platform designed to connect students directly with landlords, cutting out middleman brokerages.

## 📁 Project Structure

This project is organized as a monorepo:

- **`/frontend`**: React + Vite + Tailwind CSS (v4) + Lucide Icons.
- **`/backend`**: Spring Boot + Maven + PostgreSQL (Neon Cloud).
- **`/docs`**: (Optional) Project documentation and guides.

## 🛠️ Getting Started

### 1. Backend Setup
1. Ensure you have **JDK 25** installed (or compatible with the configured Lombok version).
2. Configure your database in `backend/src/main/resources/application.properties`.
3. Run the server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### 2. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the dev server:
   ```bash
   cd frontend
   npm run dev
   ```

## 🚀 Deployment

- **Frontend**: Pre-configured for **Vercel** (`vercel.json`).
- **Backend**: Pre-configured with a **Dockerfile** for containerized deployment.

## 🛡️ Features

- **Direct Connections**: No brokerages.
- **Secure Payments**: UPI-based subscription model with admin verification.
- **AI NestBot**: Goated Gen-Z chatbot for roommate matching and housing tips.
- **Proof Verification**: Secure document upload for landlords.
