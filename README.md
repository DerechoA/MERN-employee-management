MERN Employee Manager

MERN application (React + Express + MongoDB) with user authentication (JWT) and employee CRUD.

> Authenticated users can create/read/update/delete employees.

---

Highlights

JWT auth(register + login)
Employee CRUD (create/edit/delete) behind auth
React Router (separate pages for register/login/dashboard)
Modern UI with Tailwind + modal forms
Backend API in Express + TypeScript

---

Prerequisites

- Node.js 18+ (includes npm)
- MongoDB(local or cloud Atlas)

---

Installation

From the project root:

```bash
npm install
```

---

Configuration

Create a `.env` file in the project root with:

```env
MONGODB_URI=mongodb+srv://SAMPLEpwybbim.mongodb.net/?appName=Cluster0
JWT_SECRET=secret
PORT=3000
```

- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: key used to sign/verify JWTs
- `PORT`: (optional) port the server listens on (default 3000)

---

Run Locally

Development (hot reload)

```bash
npm run dev
```

Open: http://localhost:3000

Build + Run (production mode)

```bash
npm run build
npm run start
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

1. Open Developer Tools → Application → Local Storage → `http://localhost:3000`
2. Delete the `token` entry
3. Reload → app should redirect you back to `/login`

2) Call API without token

```bash
curl -i http://localhost:3000/api/employees
```

You should receive `401 Unauthorized`.

---

✅ Useful Scripts

| Script | What it does |
|-------|--------------|
| `npm run dev` | Start dev server (Vite + Express) |
| `npm run build` | Build frontend + bundle backend |
| `npm run start` | Run production build |
| `npm run lint` | TypeScript type check |

---

🗂️ Project Structure

- `server.ts` — Express server, routes, JWT auth
- `src/` — React app
  - `App.tsx` — Routes + dashboard UI
  - `main.tsx` — React entry point
- `.env` — environment variables

---

Notes

- Employee salaries display in **PHP (Philippine Peso)**.
- Passwords are hashed using **bcrypt**.
- JWT expires in 1 hour.

---
