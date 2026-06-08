# 🪺 CampusNest

> **Student-First Accommodation Platform** — Verified PGs · AI Roommate Matching · Smart Expense Splitting · Zero Brokerage

![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot) ![Neon](https://img.shields.io/badge/Neon-Postgres-008B8B?logo=postgresql)

---

## ⚡ Quick Start (Frontend)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173

# 3. Build for production
npm run build
# → outputs single dist/index.html
```

## 🔑 Demo Login

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@campusnest.in` | `admin123` |
| 🎓 Student | `student@campusnest.in` | `student123` |
| 🏠 Landlord | `landlord@campusnest.in` | `landlord123` |

> Or click the **Quick Demo Access** buttons on the login page.

## ✨ Features

- 🌐 **Public Landing Page** — Browse listings without login (gated details for conversion)
- 🤖 **NestAI Chatbot** — ChatGPT-style natural-language assistant
- 🤝 **Solo Seeker** — Find replacement when your roommate leaves mid-stay
- 💰 **Landlord Subscriptions** — ₹999 / ₹1,999 / ₹3,999 per month
- 🛡️ **3 Role Dashboards** — Admin, Student, Landlord with separate workflows
- 💸 **Smart Expense Splitting** — Auto-divide shared bills among flatmates
- 🔧 **Maintenance Tracker** — Tenant ↔ Landlord ticket system
- 💬 **Community Forum** — Student tips, warnings, requests

## 🏗️ Architecture

```
React + TypeScript + Vite + Tailwind  ◄──REST──►  Spring Boot 3.4 + Java 17  ◄──JDBC──►  Neon Cloud PostgreSQL
```

## 📚 Full Documentation

See [`HACKATHON_GUIDE.md`](./HACKATHON_GUIDE.md) for:
- Step-by-step IntelliJ setup
- Spring Boot backend creation
- Neon DB connection
- Pitch script for judges
- Q&A preparation

---

Built for hackathon — © 2026 CampusNest
