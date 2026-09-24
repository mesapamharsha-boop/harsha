# LEOX — Complete Frontend & Backend Monorepo Architecture

Production-grade web application and portfolio management system for **LEOX** (Mesapam Sri Harsha — Fashion, Wedding, Celebrity & Event Photographer / Filmmaker).

This repository is structured as a clean, decoupled monorepo with completely separated **frontend** and **backend** domains.

---

## Architecture Overview

```
/
├── frontend/                     # Client-side React Application
│   ├── public/                   # Static assets & client uploads
│   ├── src/
│   │   ├── assets/               # Branding, icons, logos
│   │   ├── components/           # UI & feature components
│   │   │   ├── admin/            # Admin management dashboard
│   │   │   ├── common/           # Navigation, Footer, Modals
│   │   │   ├── home/             # Landing sections
│   │   │   ├── portfolio/        # Portfolio cards & lightbox
│   │   │   └── reels/            # Reel players & feeds
│   │   ├── context/              # React Context (Auth, Cart, UI)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Main and Admin layouts
│   │   ├── pages/                # Route pages
│   │   ├── services/             # HTTP API client service
│   │   ├── types/                # Frontend TypeScript definitions
│   │   ├── utils/                # Formatting & UI utilities
│   │   ├── App.tsx               # Main component & routing
│   │   ├── index.css             # Tailwind CSS styles
│   │   ├── main.tsx              # React DOM entry point
│   │   └── vite-env.d.ts         # Vite client environment types
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies & scripts
│   ├── tsconfig.json             # Frontend TypeScript configuration
│   ├── vite.config.ts            # Vite bundler & reverse proxy config
│   └── .env.example              # Frontend environment template
│
├── backend/                      # Server-side Node.js / Express Application
│   ├── src/
│   │   ├── config/               # Database and environment configurations
│   │   ├── controllers/          # Request handlers
│   │   ├── database/             # JSON-based collection database engine
│   │   ├── middleware/           # Auth JWT, CORS, File Upload
│   │   ├── models/               # Data collections & schemas
│   │   ├── routes/               # Modular Express API endpoints
│   │   ├── services/             # Business logic (Media, Email)
│   │   ├── types/                # Backend TypeScript types
│   │   ├── utils/                # Database seeding & helpers
│   │   └── server.ts             # Express server entry point
│   ├── package.json              # Backend dependencies & scripts
│   ├── tsconfig.json             # Backend TypeScript configuration
│   └── .env.example              # Backend environment template
│
├── data/                         # Persistent storage
│   └── leox-db.json              # File database store
├── public/                       # Shared public media storage
│   └── uploads/                  # Uploaded images and videos
├── package.json                  # Root monorepo orchestration
├── metadata.json                 # AI Studio configuration
├── .env.example                  # Root environment reference
└── README.md                     # Documentation
```

---

## Quick Start & Running

### Unified Monorepo (Default)
In the root directory, install dependencies and run:
```bash
npm run dev
```
This launches the backend Express server on port `3000`, mounts Vite development middleware pointing to the `frontend/` directory, and serves all API endpoints under `/api/*`.

### Running Frontend Standalone
```bash
cd frontend
npm run dev
```
Runs the Vite development server on `http://localhost:5173` with automatic reverse-proxying of `/api` and `/uploads` to `http://localhost:3000`.

### Running Backend Standalone
```bash
cd backend
npm run dev
```
Runs the Express REST API server on `http://localhost:3000` with CORS enabled for frontend origins.

---

## Production Build & Start

```bash
# Build both frontend and backend
npm run build

# Start production server
npm run start
```

---

## Admin Credentials & Access

- **Admin Portal Path:** `/admin/login`
- **Initial Dev Admin Email:** `harsha@leox`
- **Initial Dev Admin Password:** `leoX@4536`
- **Seed Command:** `npm run seed:admin`
