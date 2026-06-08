# 🪺 CampusNest Backend (Spring Boot + Neon PostgreSQL)

Production-ready Spring Boot 3.4 REST API connected to Neon Cloud PostgreSQL.

## ⚡ Quick Start

### Prerequisites
- **Java 17** ([download](https://adoptium.net/temurin/releases/?version=17))
- **Maven 3.9+** (or use IntelliJ's bundled Maven)
- **IntelliJ IDEA** (Community or Ultimate)

### Run from IntelliJ (recommended)

1. Open IntelliJ → **File → Open** → select the `backend/` folder
2. Wait for Maven to download dependencies (1–2 min on first open)
3. Open `src/main/java/com/campusnest/CampusNestApplication.java`
4. Click the green ▶ play button next to `main()`
5. Backend starts on **http://localhost:8080**

### Run from terminal

```bash
cd backend
./mvnw spring-boot:run

# Or if you have Maven installed globally:
mvn spring-boot:run
```

## ✅ Verify it works

Open in browser:
- **Health check:** http://localhost:8080/api/v1/health
- **Listings:** http://localhost:8080/api/v1/accommodations
- **Stats:** http://localhost:8080/api/v1/stats

You should see JSON responses.

## 🔑 Demo Login Credentials (auto-seeded on first run)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@campusnest.in` | `admin123` |
| Student | `student@campusnest.in` | `student123` |
| Landlord | `landlord@campusnest.in` | `landlord123` |

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/v1/auth/register` — `{ name, email, password, phone, role }` → `{ token, user }`

### Accommodations
- `GET /api/v1/accommodations` — list all
- `GET /api/v1/accommodations/{id}` — get one
- `GET /api/v1/accommodations/landlord/{id}` — by landlord
- `POST /api/v1/accommodations` — create
- `PUT /api/v1/accommodations/{id}/verify` — admin verify
- `DELETE /api/v1/accommodations/{id}` — admin delete

### Expenses
- `GET /api/v1/expenses`
- `POST /api/v1/expenses`
- `PUT /api/v1/expenses/{id}/settle`
- `DELETE /api/v1/expenses/{id}`

### Maintenance
- `GET /api/v1/maintenance`
- `GET /api/v1/maintenance/landlord/{id}`
- `POST /api/v1/maintenance`
- `PUT /api/v1/maintenance/{id}/status` — `{ status: "open" | "in_progress" | "resolved" }`

### Subscriptions
- `GET /api/v1/subscriptions/landlord/{id}`
- `POST /api/v1/subscriptions` — `{ landlordId, plan: "starter" | "growth" | "pro" }`

### Solo Seekers
- `GET /api/v1/solo-seekers`
- `POST /api/v1/solo-seekers`

### Community
- `GET /api/v1/community/posts`
- `POST /api/v1/community/posts`
- `PUT /api/v1/community/posts/{id}/upvote`
- `POST /api/v1/community/posts/{id}/reply`

### 🆕 Property Proof Verification
- `GET  /api/v1/proofs` — all proofs (admin)
- `GET  /api/v1/proofs/pending` — pending review queue
- `GET  /api/v1/proofs/landlord/{id}` — landlord's submissions
- `GET  /api/v1/proofs/landlord/{id}/status` — verification status
- `POST /api/v1/proofs` — upload new proof (base64 image + metadata)
- `PUT  /api/v1/proofs/{id}/approve` — admin approves
- `PUT  /api/v1/proofs/{id}/reject` — admin rejects (with reason)
- `DELETE /api/v1/proofs/{id}` — delete

**Supported proof types:**
ELECTRICITY_BILL, PROPERTY_DEED, TAX_RECEIPT, RENTAL_AGREEMENT,
AADHAAR_CARD, WATER_BILL, GAS_CONNECTION, SOCIETY_NOC

**3-tier verification flow:**
1. Landlord uploads electricity bill / deed → stored in `property_proofs` table
2. Admin reviews and approves/rejects from "Verify Proofs" tab
3. Once approved, landlord can subscribe + list properties

### Users / Stats
- `GET /api/v1/users`
- `GET /api/v1/stats`
- `GET /api/v1/health`

## 🗄️ Database (Neon Cloud PostgreSQL)

The backend auto-creates tables on first run via `spring.jpa.hibernate.ddl-auto=update`.

**Connection string** (in `application.properties`):
```
jdbc:postgresql://ep-falling-queen-aptkpzkt-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### View data via IntelliJ Database Tool

1. **View → Tool Windows → Database**
2. Click **+ → Data Source → PostgreSQL**
3. Fill:
   - Host: `ep-falling-queen-aptkpzkt-pooler.c-7.us-east-1.aws.neon.tech`
   - Port: `5432`
   - User: `neondb_owner`
   - Password: `npg_Pev0aVl5pIoB`
   - Database: `neondb`
4. **Advanced → URL parameters:** `sslmode=require`
5. **Test Connection** → ✅ → **OK**

Now you'll see all 7 tables auto-created:
- `users`, `accommodations`, `expenses`, `maintenance_requests`,
- `subscriptions`, `solo_seekers`, `community_posts`

## 🐛 Troubleshooting

### "Connection to Neon DB failed"
- Check internet connection (Neon is cloud-hosted)
- Verify the URL/credentials in `application.properties`
- Make sure port 8080 is free: `lsof -i :8080` (Mac/Linux) or `netstat -ano | findstr :8080` (Windows)

### "CORS error" in browser
- Verify React is running on `http://localhost:5173`
- If on different port, edit `application.properties`:
  ```
  campusnest.cors.allowed-origins=http://localhost:5173,http://localhost:YOUR_PORT
  ```

### Java version error
- Ensure JAVA_HOME points to Java 17
- In IntelliJ: **File → Project Structure → Project SDK → 17**

### Tables not created
- Drop schema manually in Neon, restart Spring Boot
- Or change `ddl-auto=create-drop` once, then back to `update`

## 📦 Tech Stack

- **Spring Boot** 3.4.1
- **Java** 17
- **Spring Data JPA** + Hibernate 6
- **PostgreSQL** Driver 42.x
- **HikariCP** Connection Pool
- **Lombok** (boilerplate reduction)
- **BCrypt** (password hashing)

---

Made with ❤️ for CampusNest hackathon
