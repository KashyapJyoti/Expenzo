<<<<<<< HEAD
## Expenzo – MERN Expense Tracker

Expenzo is a production-ready MERN stack expense tracker with JWT auth, rich dashboards, charts, and smart money tips.

### Tech Stack

- **Frontend**: React (Vite), TailwindCSS, React Router, Axios, Lucide React, Chart.js via `react-chartjs-2`
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **State Management**: React Context API

Project structure:

- `server/` – Express API, MongoDB models, controllers, routes, seed script
- `client/` – Vite React SPA with Tailwind, charts, and pages

---

### 1. Environment Variables

#### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env` and adjust:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenzo
JWT_SECRET=supersecretjwtkey_change_me
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env` if you want to override defaults:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 2. Installation

From the project root (`Expenzo1`):

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

### 3. Running the App

#### Start MongoDB

Make sure a MongoDB instance is running locally (default: `mongodb://localhost:27017`).

#### Seed sample data (optional but recommended)

```bash
cd server
cp .env.example .env   # or create your own .env
npm run seed
```

This creates a demo user and sample transactions:

- **Email**: `demo@expenzo.com`
- **Password**: `password123`

#### Run backend

```bash
cd server
npm run dev   # or: npm start
```

The API will be available at `http://localhost:5000/api`.

#### Run frontend

In another terminal:

```bash
cd client
npm run dev
```

The SPA will be available at `http://localhost:5173`.

---

### 4. Backend Overview

- **Models**
  - `User`: `name`, `email` (unique), `password` (bcrypt hashed), timestamps
  - `Transaction`: `userId` (ref `User`), `type` (`income` | `expense`), `amount`, `category`, `description`, `date`, timestamps
- **Auth Routes**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - Returns user profile and JWT (`7d` expiry)
- **Transaction Routes** (JWT protected)
  - `GET /api/transactions`
  - `POST /api/transactions`
  - `PUT /api/transactions/:id`
  - `DELETE /api/transactions/:id`
- **Dashboard Route** (JWT protected)
  - `GET /api/dashboard/summary` → returns:
    - `totalIncome`
    - `totalExpenses`
    - `balance`
    - `totalTransactions`
    - `lastMonthComparison`
    - `categoryWiseBreakdown`
    - `monthlyTrend`

Key folders in `server/`:

- `config/db.js` – MongoDB connection
- `models/` – `User`, `Transaction`
- `controllers/` – `authController`, `transactionController`, `dashboardController`
- `routes/` – `authRoutes`, `transactionRoutes`, `dashboardRoutes`
- `middleware/auth.js` – JWT `protect` middleware
- `seed/seed.js` – sample data script

---

### 5. Frontend Overview

The frontend is a Vite React SPA styled with Tailwind and uses Context API for auth, theme, and transaction state.

#### State & Utilities

- `context/AuthContext.jsx`
  - Manages `user`, `token`, and `isAuthenticated`
  - Persists to `localStorage` under `expenzo_auth`
  - Handles login/logout and redirect
- `context/ThemeContext.jsx`
  - Dark mode via `class="dark"` on `html`
  - Persisted theme in `localStorage`
- `context/TransactionContext.jsx`
  - Fetches `/transactions` and `/dashboard/summary`
  - Exposes `transactions`, `dashboard`, `loading`, `error`
  - Provides `addTransaction`, `updateTransaction`, `deleteTransaction`
- `lib/api.js`
  - Axios instance with base URL from `VITE_API_BASE_URL`
  - Adds `Authorization: Bearer <token>` via interceptor
  - Centralised error logging
- `utils/currency.js`
  - `formatCurrency(₹)` helper using `en-IN` locale

#### Routing & Layout

- React Router v6:
  - Public: `/login`, `/register`
  - Protected (via `ProtectedRoute`):
    - `/` – Dashboard
    - `/transactions`
    - `/charts`
    - `/tips`
- Layout:
  - `Sidebar` – Navigation (Dashboard, Transactions, Charts, Tips, Logout)
  - `Navbar` – Date display + dark mode toggle + user info
  - `AppLayout` – Shared shell for protected pages

#### Pages

- **Login / Register**
  - Auth forms using Axios to `/api/auth/login` and `/api/auth/register`
  - Stores JWT + user in `localStorage`
- **Dashboard**
  - Cards: Total Income, Total Expenses, Balance, Total Transactions
  - Doughnut chart: Category-wise expenses
  - Monthly comparison (income/expense change vs previous month)
  - Recent transactions table
- **Transactions**
  - Search by description/category
  - Filter by type and category
  - Pageless list of all user transactions
  - Delete action
  - `AddTransactionModal` for new income/expense entry
- **Charts**
  - Doughnut chart: Category-wise expenses
  - Bar chart: Income vs Expenses per month
  - Line chart: Net savings trend
- **Tips**
  - Smart tips based on:
    - Increase/decrease in savings
    - Increase/decrease in spending
    - Savings rate vs the 50/30/20 rule
  - Static explanation of the 50/30/20 rule

#### Charts

Charts are built with `chart.js` + `react-chartjs-2`:

- `CategoryDoughnut` – category-wise breakdown
- `IncomeExpenseBar` – monthly income vs expense bars
- `SpendingLine` – net savings line over time

---

### 6. Production Notes

- **Security**
  - Passwords are hashed with bcrypt before saving
  - JWT secret is sourced from environment variables
  - All data routes are protected via `Authorization: Bearer <token>`
- **Error Handling**
  - Backend returns clear JSON error messages
  - Frontend surfaces errors on forms and dashboard panels
- **Performance & UX**
  - Minimal, re-usable components (`StatsCard`, `Loader`, layout shell)
  - Subtle shadows, rounded cards, and brand colors for income/expense
  - Responsive layout for desktop and mobile

---

### 7. Quick Start (TL;DR)

```bash
# in one terminal (backend)
cd server
cp .env.example .env
npm install
npm run seed    # optional
npm run dev

# in another terminal (frontend)
cd client
cp .env.example .env   # optional override
npm install
npm run dev
```

Then open `http://localhost:5173`, log in with the demo account, and start exploring your Expenzo dashboard.
=======
# Expenzo
>>>>>>> 2c0c14bfa48d3ef772f7ac8797ea553a797a48c2
