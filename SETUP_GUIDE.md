# 🚀 CampusNest — Complete Local Setup Guide

> **Goal:** Run the entire stack locally on your laptop — Frontend (React) + Backend (Spring Boot) + Database (Neon Cloud PostgreSQL) — all communicating in real-time.

---

## 📋 Prerequisites — Install These First

| Tool | Version | Download Link |
|------|---------|---------------|
| **Java JDK** | 17 or higher | https://adoptium.net/temurin/releases/?version=17 |
| **Node.js** | 18 or higher | https://nodejs.org/ |
| **IntelliJ IDEA** | Community or Ultimate | https://www.jetbrains.com/idea/ |
| **VS Code** (optional, for frontend) | latest | https://code.visualstudio.com/ |
| **Maven** (optional — IntelliJ has built-in) | 3.9+ | https://maven.apache.org/download.cgi |

### Verify installations:

```bash
java -version    # should show 17+
node -v          # should show v18+
npm -v           # should show 9+
mvn -version     # optional, should show 3.9+
```

---

## 🗂️ Project Structure

```
campusnest/
├── backend/                ← Spring Boot project (open in IntelliJ)
│   ├── pom.xml
│   ├── src/main/java/com/campusnest/
│   │   ├── CampusNestApplication.java
│   │   ├── config/         (CORS, DataSeeder)
│   │   ├── entity/         (User, Accommodation, etc.)
│   │   ├── repository/     (JPA repos)
│   │   ├── controller/     (REST endpoints)
│   │   └── dto/            (request/response shapes)
│   └── src/main/resources/
│       └── application.properties
│
├── src/                    ← React frontend
│   ├── pages/
│   ├── components/
│   ├── services/api.ts     ← Calls Spring Boot at localhost:8080
│   └── App.tsx
├── package.json
├── README.md
└── SETUP_GUIDE.md          ← (this file)
```

---

## 🎯 Step 1: Run the Spring Boot Backend

### Option A: From IntelliJ IDEA (RECOMMENDED)

1. Open IntelliJ IDEA
2. **File → Open** → navigate to the **`backend/`** folder → **OK**
3. IntelliJ will auto-detect it as a Maven project. **Trust** the project when prompted.
4. Wait for Maven to download all dependencies (~2 minutes on first open). You'll see a progress bar at the bottom.
5. Once done, open `src/main/java/com/campusnest/CampusNestApplication.java`
6. You'll see a green ▶ arrow next to the `main()` method → **click it**
7. Wait ~10 seconds. You should see:

```
  🪺 Starting CampusNest Backend...
  📡 Connecting to Neon Cloud PostgreSQL...

🌱 Seeding initial data into Neon Cloud Postgres…
  ✓ Seeded 6 users
  ✓ Seeded 5 accommodations
  ✓ Seeded 3 expenses
  ✓ Seeded 2 maintenance requests
  ✓ Seeded 1 solo seeker posts
  ✓ Seeded 2 community posts
🎉 Seed complete!

  ✅ CampusNest Backend READY!
  🌐 API:      http://localhost:8080/api/v1
  🔍 Health:   http://localhost:8080/api/v1/health
```

8. ✅ Backend is running on **http://localhost:8080**

### Option B: From Terminal

```bash
cd backend
mvn spring-boot:run
```

### Verify backend works

Open in browser:
- 👉 http://localhost:8080/api/v1/health → should show `{"status":"UP", ...}`
- 👉 http://localhost:8080/api/v1/accommodations → should show 5 listings as JSON

---

## 🎯 Step 2: Run the React Frontend

Open a **new terminal** (don't close the backend one!):

```bash
# From the project root (NOT the backend folder)
cd ..    # if you're in backend/
npm install         # only needed first time, ~1 min
npm run dev
```

You'll see:
```
VITE v7.3.2  ready in 423 ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in browser. ✅ You should see the CampusNest landing page!

---

## 🎯 Step 3: Test the Full Stack

1. On landing page, click **"Sign Up Free"** → Login page opens
2. Click **Quick Demo Access** → click **🎓 Student** button → email/password auto-fills
3. Click **Sign In** → should log in successfully (this hits Spring Boot which queries Neon DB!)
4. Once logged in:
   - Go to **Housing** tab → see 5 listings (all from Neon database!)
   - Go to **Expenses** → add a new expense → it gets saved to Neon DB
   - Go to **Maintenance** → submit a request → check IntelliJ DB tool to see it appear!

---

## 🎯 Step 4: View the Live Database (Optional but cool!)

This makes your hackathon demo extra impressive:

1. In IntelliJ → **View → Tool Windows → Database**
2. Click **+ → Data Source → PostgreSQL**
3. Fill in:
   - **Host:** `ep-falling-queen-aptkpzkt-pooler.c-7.us-east-1.aws.neon.tech`
   - **Port:** `5432`
   - **User:** `neondb_owner`
   - **Password:** `npg_Pev0aVl5pIoB`
   - **Database:** `neondb`
   - Click **Advanced** tab → set **URL parameters:** `sslmode=require`
4. Click **Test Connection** → ✅
5. Click **OK**
6. Expand the database in left panel → see all 7 tables

Now while demoing, every time you add data in the React app, refresh the database table and **show the new row appearing live in the cloud database!** 🤯

---

## 🎯 Step 5: Build for Production

### Frontend
```bash
npm run build
# Creates a single dist/index.html (everything bundled in)
```

### Backend
```bash
cd backend
mvn clean package
# Creates target/backend-0.0.1-SNAPSHOT.jar
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Troubleshooting

### Frontend shows "⚠️ Cannot reach backend at http://localhost:8080"

**Solution:** Spring Boot isn't running. Go to IntelliJ and click ▶ on `CampusNestApplication`.

### Backend fails with "Connection to Neon DB failed"

**Possible causes:**
- No internet connection (Neon is cloud-hosted)
- Firewall blocking port 5432 outbound
- Wrong credentials in `application.properties`

### "Port 8080 is already in use"

**Mac/Linux:**
```bash
lsof -ti:8080 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

Or change port in `application.properties`:
```properties
server.port=8081
```
And update `src/services/api.ts`:
```typescript
const API_BASE = 'http://localhost:8081/api/v1';
```

### CORS error in browser console

Make sure React is running on **port 5173**. If different, add it to `application.properties`:
```properties
campusnest.cors.allowed-origins=http://localhost:5173,http://localhost:YOUR_PORT
```

### "Tables already exist" error

Run this in Neon SQL editor or IntelliJ DB tool:
```sql
DROP TABLE IF EXISTS users, accommodations, expenses, maintenance_requests,
                     subscriptions, solo_seekers, community_posts CASCADE;
```
Then restart Spring Boot — it'll recreate them fresh.

### Maven download stuck in IntelliJ

**File → Settings → Build Tools → Maven** → check that Maven home is set correctly.

If still stuck, run from terminal:
```bash
cd backend
./mvnw clean install -U
```

---

## 🎬 Hackathon Demo Flow

### Setup (do BEFORE judging starts)
- [ ] Backend running in IntelliJ — ▶ already pressed, console shows "READY!"
- [ ] Frontend running in another terminal — `npm run dev`
- [ ] Neon Database tab open in IntelliJ showing tables
- [ ] Browser tab on **http://localhost:5173**
- [ ] Backup: deployed URL on phone

### 3-minute pitch script

**[0:00 — 0:30] Hook + Landing**
> "We built CampusNest — a student housing platform with AI roommate matching, fraud-proof landlord verification and zero brokerage. Watch end-to-end."

Open http://localhost:5173 → "Public landing — students browse without signup. Details locked behind login."

**[0:30 — 1:30] Student Demo**
- Login as student
- Open AI chatbot → type "Find me a PG in Noida under ₹12k"
- Show ChatGPT-style response
- Go to **Solo Seeker** → "If your roommate leaves mid-semester, post your spot here"
- Add an expense → IntelliJ DB tool → **show row appearing live in Neon!**

**[1:30 — 2:30] Landlord Demo (3-step verification!)**
- Logout → Login as landlord
- Click **Add Listing** → blocked! "❗ Property Proof Required"
- Click **Proof & Verify** tab → upload electricity bill image
- Show file gets stored in `property_proofs` table in Neon DB
- Logout → Login as admin → **Verify Proofs** tab → approve the upload
- Switch back to landlord → now Add Listing asks for **Subscription**
- Subscribe to Growth plan → form unlocked → add property → see in Neon!

**[2:30 — 2:50] Admin Demo**
- Show analytics + verify pending listings
- DB tool shows real-time changes

**[2:50 — 3:00] Closing**
> "3-tier landlord verification (proof → subscription → admin approval) means students never get scammed. Full stack: React + Spring Boot 3.4 + Neon Cloud PostgreSQL. Thank you!"

---

## 🏆 Why This Architecture Wins

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | React 19 + Vite + Tailwind 4 | Lightning-fast dev, modern stack |
| **State** | React Context + sessionStorage | No Redux bloat needed |
| **Backend** | Spring Boot 3.4 + Java 17 | Enterprise-grade, JVM ecosystem |
| **ORM** | Spring Data JPA | Auto-generated queries, type-safe |
| **Database** | Neon Cloud PostgreSQL | Serverless = scales to zero, branching for safe migrations |
| **Auth** | BCrypt + simple tokens | Easy to upgrade to JWT |
| **CORS** | WebMvcConfigurer | Clean cross-origin handling |
| **Pool** | HikariCP | Best-in-class connection pooling |

---

## 🎯 Quick Commands Cheatsheet

```bash
# === BACKEND ===
cd backend
mvn spring-boot:run        # Start Spring Boot (or use IntelliJ ▶)
mvn clean package          # Build JAR
java -jar target/*.jar     # Run JAR

# === FRONTEND ===
npm install                # Install dependencies (first time only)
npm run dev                # Start dev server (localhost:5173)
npm run build              # Production build (single HTML)

# === DATABASE (in IntelliJ DB tool) ===
SELECT * FROM users;
SELECT * FROM accommodations WHERE verified = true;
SELECT COUNT(*) FROM expenses WHERE status = 'pending';
```

---

## ✅ Final Checklist Before Demo

- [ ] Java 17 installed (`java -version`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] Backend opens in IntelliJ without errors
- [ ] `npm install` ran successfully in frontend
- [ ] Backend starts and shows "✅ READY!"
- [ ] http://localhost:8080/api/v1/health returns 200
- [ ] http://localhost:5173 loads the landing page
- [ ] Login works with `student@campusnest.in / student123`
- [ ] Adding an expense shows up in Neon DB tool
- [ ] All three demo accounts (admin/student/landlord) tested

---

**You're ready to win this hackathon! 🏆**

If anything breaks during demo, fall back to the deployed URL on your phone. Good luck!
