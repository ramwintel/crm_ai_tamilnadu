# CRM Application

A full-stack Customer Relationship Management (CRM) application with subscription-based access, analytics dashboard, and secure payment integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v3, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | Email-based sign-in + JWT |
| Payments | Cashfree Payments (sandbox/production) |
| HTTP Client | Axios |
| Notifications | React Toastify |

---

## Features

### Authentication
- Email-based sign-in — no password required, no Google Cloud Console setup
- New users are auto-created on first sign-in
- Auto-generated avatars via `ui-avatars.com`
- JWT tokens stored in `localStorage`, valid for 7 days
- Session restored automatically on page refresh

### Subscription & Payments
- ₹27,000 annual subscription plan gated behind Cashfree payment
- Cashfree Payments JS SDK loaded directly in the browser (no redirect)
- Payment status verified server-side after checkout
- Subscription status tracked per user: `inactive → pending → active`
- All CRM features locked until subscription is active

### Dashboard (Analytics)
- **Customer Status Pie Chart** — Active vs Inactive breakdown
- **Lead Status Bar Chart** — New / Contacted / Qualified / Proposal / Won / Lost
- **Lead Source Donut Chart** — Website, Referral, Cold Call, Social Media, Email
- **Pipeline Value by Status** — Total deal value per lead stage
- **Leads Over Time Line Chart** — Monthly lead creation trend
- **Customers by Company** — Horizontal bar chart of company distribution

### Customers Module
- Add, view, edit, and delete customers
- Fields: Name, Email, Phone, Company, Status (Active/Inactive), Notes
- Search by name/email/company
- Filter by status

### Leads Module
- Add, view, edit, and delete leads
- Fields: Name, Email, Phone, Company, Status, Source, Deal Value, Notes
- Search by name/email/company
- Filter by status and source
- Deal value tracking with pipeline view

---

## Project Structure

```
crm-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Email sign-in, JWT generation
│   │   ├── customerController.js    # Customer CRUD + stats
│   │   ├── leadController.js        # Lead CRUD + stats
│   │   └── paymentController.js     # Cashfree order creation & verification
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT guard + subscription check
│   ├── models/
│   │   ├── Customer.js              # Customer schema
│   │   ├── Lead.js                  # Lead schema
│   │   └── User.js                  # User schema (auth + subscription)
│   ├── routes/
│   │   ├── auth.js                  # POST /api/auth/login, GET /api/auth/me
│   │   ├── customers.js             # CRUD + stats routes
│   │   ├── leads.js                 # CRUD + stats routes
│   │   └── payment.js               # Order create, verify, webhook
│   ├── seed.js                      # Dummy data seeder (8 customers, 10 leads)
│   ├── server.js                    # Express entry point
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html               # Includes Cashfree JS SDK
    └── src/
        ├── components/
        │   └── Sidebar.jsx          # Navigation with user profile & logout
        ├── context/
        │   └── AuthContext.jsx      # Global auth state, loginWithEmail()
        ├── pages/
        │   ├── Dashboard.jsx        # 6 Recharts analytics charts
        │   ├── Customers.jsx        # Customer list with search/filter
        │   ├── CustomerForm.jsx     # Add/Edit customer form
        │   ├── Leads.jsx            # Lead list with search/filter
        │   ├── LeadForm.jsx         # Add/Edit lead form
        │   ├── Login.jsx            # Email + name sign-in form
        │   ├── Subscription.jsx     # ₹27,000 pricing page + Cashfree checkout
        │   └── PaymentCallback.jsx  # Post-payment verification page
        ├── services/
        │   └── api.js               # Axios instance with JWT interceptor
        ├── App.js                   # Routes with RequireAuth + RequireSubscription guards
        └── index.css                # Tailwind CSS base styles
```

---

## Prerequisites

- Node.js v16 or higher
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- A [Cashfree Payments](https://merchant.cashfree.com) account (sandbox for testing)

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET=your_cashfree_secret_key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

> **Note:** Never commit `.env` to version control. It is excluded via `.gitignore`.

---

## Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/ramwintel/crm_ai_tamilnadu.git
cd crm_ai_tamilnadu
```

### 2. Configure Environment

Copy the `.env` template above into `backend/.env` and fill in your credentials.

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Seed Dummy Data (Optional)

```bash
cd backend
node seed.js
```

This inserts 8 sample customers and 10 sample leads into your MongoDB database.

### 5. Start the Backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### 6. Start the Frontend

```bash
cd frontend
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Sign in / register by email | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Login Response:**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe",
    "subscriptionStatus": "inactive"
  }
}
```

---

### Payment

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment/create-order` | Create Cashfree payment order | Yes |
| GET | `/api/payment/verify?order_id=X` | Verify payment & activate subscription | Yes |
| POST | `/api/payment/webhook` | Cashfree server-to-server webhook | No |

---

### Customers *(requires active subscription)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers (supports `?search=`, `?status=`) |
| POST | `/api/customers` | Create a new customer |
| GET | `/api/customers/:id` | Get customer by ID |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/customers/stats` | Aggregated customer statistics |

---

### Leads *(requires active subscription)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads (supports `?search=`, `?status=`, `?source=`) |
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads/:id` | Get lead by ID |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/leads/stats` | Aggregated lead statistics + pipeline value |

---

## User Flow

```
Visit App
    │
    ▼
Login Page  ──► Enter Email + Name ──► JWT issued
    │
    ▼
Subscription Status Check
    │
    ├── inactive/pending ──► Subscription Page ──► Cashfree Checkout
    │                                                     │
    │                                              Payment Success
    │                                                     │
    │                                           Verify → Activate Account
    │
    └── active ──► Dashboard (full access)
                        ├── Customers
                        ├── Leads
                        └── Analytics Charts
```

---

## Payment Integration (Cashfree)

1. User clicks **"Pay ₹27,000 Securely"** on the Subscription page
2. Backend creates an order via Cashfree API and returns a `paymentSessionId`
3. Frontend initializes `window.Cashfree({ mode: 'sandbox' })` and calls `.checkout()`
4. User completes payment inside the Cashfree-hosted modal
5. Cashfree redirects to `/payment/callback?order_id=<id>`
6. Backend verifies order status and sets `subscriptionStatus: 'active'` on the user
7. User is redirected to the Dashboard

> To switch to production, change `mode: 'sandbox'` to `mode: 'production'` in `Subscription.jsx` and update the Cashfree API URL in `paymentController.js` from `https://sandbox.cashfree.com/pg` to `https://api.cashfree.com/pg`.

---

## License

MIT
