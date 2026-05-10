# Thrift 

A full-stack second-hand marketplace built with React, Node.js/Express, Prisma, and PostgreSQL.

## Features

- **Buyers**: Browse paginated products, filter by category/price/search, wishlist, cart, checkout wizard, order history, star reviews, real-time chat with sellers, report abuse
- **Sellers**: Dedicated dashboard with earnings overview, product management (edit, delete, bulk ZIP import), order tracking
- **Admins**: Product approval workflow (PENDING → APPROVED / REJECTED), flagged products (auto-flagged after 3 reports), report management (dismiss / suspend), order management

### Technical Highlights
- MIME validation, EXIF stripping, perceptual-hash duplicate detection, auto-thumbnail generation
- CSRF protection, XSS sanitisation, Helmet security headers
- Role-based access control (USER / SELLER / ADMIN)
- Real-time chat via Socket.IO
- Soft-delete with restore for products

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| Auth | JWT (HTTP-only cookie) |

---

## Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local or hosted)
- npm

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd Thrift
```

### 2. Configure environment variables

Copy the example files and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Backend** (`backend/.env`):

| Variable | Description |
|---|---|
| `PORT` | Port to run the server on (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` or `production` |

**Frontend** (`frontend/.env`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of the backend API (e.g. `http://localhost:3000`) |

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Set up the database

```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Run the development servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend will be available at **http://localhost:5173** and the backend at **http://localhost:3000**.

---

## Project Structure

```
Thrift/
├── backend/
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── controllers/ # Route handler logic
│   │   ├── middlewares/ # Auth, CSRF, XSS, upload, validation
│   │   ├── routes/      # Express routers
│   │   ├── services/    # Business logic & DB queries
│   │   ├── utils/       # Image processing, CSV parser, ZIP extractor
│   │   └── server.ts    # Entry point
│   └── uploads/         # Uploaded product images
└── frontend/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # UI components (admin, seller, products, cart…)
        ├── Context/     # Auth context
        ├── layouts/     # MainLayout, AuthLayout
        └── services/    # API service functions
```
