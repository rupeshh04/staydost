# 🏠 StayDost — PG & Flat Finder Platform

> A production-ready rental property platform for India, connecting tenants with PGs and flats through an agent-managed system.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Admin Credentials](#admin-credentials)
- [API Endpoints](#api-endpoints)
- [Business Logic](#business-logic)

---

## ✨ Features

### 👤 User Side
- Browse PGs & Flats **without registration**
- Search by location (Laxmi Nagar, Mukherjee Nagar, Karol Bagh, etc.)
- Filters: Property type, Price range, Amenities, Gender preference
- Detailed property pages with image gallery
- Contact Agent via form or WhatsApp
- Book property visits
- Submit property (owner flow)

### 🛡️ Admin Panel
- Secure JWT-authenticated dashboard
- Add / Edit / Delete properties
- Approve or reject owner-submitted listings
- View & manage all inquiries (leads)
- Update lead status (New → Contacted → Visit Scheduled → Closed)
- Manage users & property owners

### 🏘️ Owner Flow
- Submit property details + images
- Listing goes to admin for review
- Admin publishes approved listings
- **Owner contact details are NEVER shown to users**

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|-------------------------------------|
| Frontend   | React 18 (Vite), React Router v6    |
| Styling    | Pure CSS3 with CSS Variables        |
| Icons      | React Icons (Font Awesome + Feather)|
| Backend    | Node.js + Express.js                |
| Database   | MongoDB + Mongoose ODM              |
| Auth       | JWT (JSON Web Tokens) + Bcrypt      |
| Rate Limit | Express Rate Limiter                |
| Security   | Helmet.js, CORS, Input Validation   |
| Images     | Cloudinary (optional) / Local URLs  |

---

## 📁 Project Structure

```
StayDost/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login, register, me
│   │   ├── propertyController.js
│   │   ├── leadController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── upload.js           # Multer + Cloudinary
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── leads.js
│   │   └── users.js
│   ├── seed/
│   │   └── seedData.js         # Sample data seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx # Admin sidebar layout
│   │   │   ├── Footer.jsx
│   │   │   ├── LeadForm.jsx    # Contact/inquiry modal
│   │   │   ├── Navbar.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   └── WhatsAppButton.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetail.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── SubmitProperty.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageProperties.jsx
│   │   │       ├── ManageLeads.jsx
│   │   │       ├── AddProperty.jsx
│   │   │       └── ManageUsers.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API service
│   │   ├── utils/
│   │   │   └── helpers.js      # Utility functions
│   │   ├── App.jsx
│   │   ├── index.css           # Global styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18.x
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
```

### 3. Seed Sample Data

```bash
cd backend
npm run seed
# This creates 1 admin, 15 properties, and 5 sample leads
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### 5. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:5173/admin/login

---

## 🔑 Admin Credentials (after seeding)

| Field    | Value                 |
|----------|-----------------------|
| Email    | admin@staydost.com    |
| Password | admin123              |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | /api/auth/login    | Public  | Admin/User login     |
| POST   | /api/auth/register | Public  | Register new user    |
| GET    | /api/auth/me       | Private | Get current user     |

### Properties
| Method | Endpoint                       | Access  | Description               |
|--------|--------------------------------|---------|---------------------------|
| GET    | /api/properties                | Public  | Get all approved listings |
| GET    | /api/properties/:id            | Public  | Get single property       |
| POST   | /api/properties                | Private | Add property              |
| PUT    | /api/properties/:id            | Admin   | Update property           |
| DELETE | /api/properties/:id            | Admin   | Delete property           |
| PUT    | /api/properties/:id/approve    | Admin   | Approve listing           |
| PUT    | /api/properties/:id/feature    | Admin   | Toggle featured           |

### Leads
| Method | Endpoint         | Access  | Description             |
|--------|------------------|---------|-------------------------|
| POST   | /api/leads       | Public  | Submit inquiry          |
| GET    | /api/leads       | Admin   | Get all leads           |
| PUT    | /api/leads/:id   | Admin   | Update lead status      |
| DELETE | /api/leads/:id   | Admin   | Delete lead             |

### Users
| Method | Endpoint         | Access  | Description         |
|--------|------------------|---------|---------------------|
| GET    | /api/users       | Admin   | Get all users       |
| DELETE | /api/users/:id   | Admin   | Delete user         |

---

## 💼 Business Logic

1. **Admin adds** properties to the platform
2. **Owner submits** a property → goes to admin as `pending`
3. **Admin approves** → listing becomes visible
4. **User browses** without needing to log in
5. **User inquires** → lead is created → goes to admin
6. **Admin contacts** user → arranges visit → closes deal
7. **Admin earns** commission from both tenant and owner
8. **Owner contact details** are NEVER exposed to users

---

## 🔐 Security Features
- JWT tokens with expiry
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 requests / 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation & sanitization
- Admin-only route protection

---

## 📄 License
MIT License — StayDost © 2024
