MERN Employee Manager

MERN application (React + Express + MongoDB) with user authentication (JWT) and employee CRUD.

> Authenticated users can create/read/update/delete employees.

---

Highlights

JWT auth(register + login)
Employee CRUD (create/edit/delete) behind auth
React Router (separate pages for register/login/dashboard)
Modern UI with Tailwind + modal forms
Backend API in Express + Node.js
Docker containerized setup with MongoDB

---

Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development only)

---

Installation & Setup

## Using Docker (Recommended)

1. Clone the repository and navigate to the project root
2. Build and start all services:

```bash
docker-compose up -d
```

This will start:
- MongoDB database (port 27017)
- Backend API (port 5000)
- Frontend React app (port 3001)

3. Access the application at: http://localhost:3001

## Local Development (Alternative)

If you prefer to run services individually:

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```env
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Start the backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

Configuration

## Docker Environment

All environment variables are configured in `docker-compose.yml`:

- **MongoDB**: Runs in container with authentication
- **Backend**: Connects to MongoDB container
- **JWT Secret**: Configured in docker-compose.yml
- **Ports**: Backend (5000), Frontend (3001), MongoDB (27017)

## Production Deployment

For production, update these values in `docker-compose.yml`:
- `JWT_SECRET`: Change to a secure random string
- MongoDB credentials: Update `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`

---

Run Commands

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## Local Development Commands

```bash
# Backend (from backend/ directory)
npm start          # Production mode
npm run dev        # Development mode (if available)

# Frontend (from frontend/ directory)
npm run dev        # Development server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
```

---
How Authentication Works

1. Register / Login pages request `/api/auth/register` or `/api/auth/login`.
2. Backend returns a JWT token after successful auth.
3. Client stores the token in `localStorage` under key `token`.
4. Any dashboard API request includes:

```
Authorization: Bearer <token>
```

5. If the token is missing/invalid, the backend returns 401 Unauthorized.

✅ This means only users with a valid token(i.e., logged in) can manage employees.

---

Testing “Unauthorized” behavior

1) Remove token manually

1. Open Developer Tools → Application → Local Storage → `http://localhost:3001`
2. Delete the `token` entry
3. Reload → app should redirect you back to `/login`

2) Call API without token

```bash
curl -i http://localhost:5000/api/employees
```

You should receive `401 Unauthorized`.

---

API Documentation

When running locally, visit: http://localhost:5000/api-docs

---

Project Structure

```
MERN-employee-management/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   └── server.js        # Main server file
│   ├── Dockerfile           # Backend container config
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules (auth, dashboard)
│   │   ├── services/        # API service functions
│   │   └── pages/           # Page components
│   ├── Dockerfile           # Frontend container config
│   └── package.json
├── docker-compose.yml       # Multi-service orchestration
└── README.md
```

---

Notes

- Employee salaries display in **PHP (Philippine Peso)**.
- Passwords are hashed using **bcrypt**.
- JWT expires in 1 hour.

---
