# CRM Application

A simple Customer Relationship Management (CRM) app built with:

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Features

- **Dashboard** – Overview stats for customers and leads
- **Customers** – Full CRUD: Add, View, Edit, Delete customers with status filtering
- **Leads** – Full CRUD: Add, View, Edit, Delete leads with deal value tracking
- Search & filter on both Customers and Leads

## Project Structure

```
crm-app/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/    # Sidebar
        ├── pages/         # Dashboard, Customers, Leads, Forms
        ├── services/      # Axios API calls
        └── App.js
```

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally on port 27017)

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## API Endpoints

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | /api/customers            | Get all customers      |
| POST   | /api/customers            | Create customer        |
| GET    | /api/customers/:id        | Get customer by ID     |
| PUT    | /api/customers/:id        | Update customer        |
| DELETE | /api/customers/:id        | Delete customer        |
| GET    | /api/customers/stats      | Customer statistics    |
| GET    | /api/leads                | Get all leads          |
| POST   | /api/leads                | Create lead            |
| GET    | /api/leads/:id            | Get lead by ID         |
| PUT    | /api/leads/:id            | Update lead            |
| DELETE | /api/leads/:id            | Delete lead            |
| GET    | /api/leads/stats          | Lead statistics        |
