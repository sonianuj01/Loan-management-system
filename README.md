# Next-Gen Lending Platform

A full-stack Loan Management System (LMS) built using **Next.js, TypeScript, MongoDB, and JWT Authentication**.

The platform supports:

* Borrower onboarding and loan application workflow
* Role-based staff dashboards
* Business Rules Engine (BRE) eligibility checks
* Salary slip upload validation
* Loan configuration with live repayment calculations
* JWT-based authentication and authorization

---

# Features

## Borrower Features

* User Registration & Login
* Eligibility Verification (BRE Engine)
* Salary Slip Upload
* Loan Configuration
* Live Interest & Repayment Calculator
* Loan Application Submission
* Secure JWT Authentication

## Staff Features

* Role-Based Login
* Dashboard Access Control
* Sales Module
* Sanction Module
* Disbursement Module
* Collection Module
* Admin Access

---

# Tech Stack

## Frontend

* Next.js 15+
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js API Routes
* JWT Authentication
* bcryptjs

## Database

* MongoDB
* Mongoose

---

# Borrower Flow

```text
Home Page
    ↓
Sign Up / Login
    ↓
Personal Details
    ↓
BRE Eligibility Check
    ↓
Upload Salary Slip
    ↓
Configure Loan
    ↓
Submit Application
```

---

# Staff Workflow

```text
Staff Login
    ↓
Role Verification
    ↓
Dashboard
    ↓
Role-Based Module Access

Admin
 ├── Sales
 ├── Sanction
 ├── Disbursement
 └── Collection
```

---

# Seeded Staff Credentials

The application provides seeded users for testing.

Password for ALL seeded accounts:

```text
password123
```

| Role         | Email                                               | Password    |
| ------------ | --------------------------------------------------- | ----------- |
| Admin        | [admin@lms.com](mailto:admin@lms.com)               | password123 |
| Sales        | [sales@lms.com](mailto:sales@lms.com)               | password123 |
| Sanction     | [sanction@lms.com](mailto:sanction@lms.com)         | password123 |
| Disbursement | [disbursement@lms.com](mailto:disbursement@lms.com) | password123 |
| Collection   | [collection@lms.com](mailto:collection@lms.com)     | password123 |

---

# Seeded Borrower Account

| Role     | Email                                       | Password    |
| -------- | ------------------------------------------- | ----------- |
| Borrower | [borrower@lms.com](mailto:borrower@lms.com) | password123 |

---

# Role Access Matrix

| Module           | Admin | Sales | Sanction | Disbursement | Collection | Borrower |
| ---------------- | ----- | ----- | -------- | ------------ | ---------- | -------- |
| Dashboard        | ✅     | ✅     | ✅        | ✅            | ✅          | ❌        |
| Sales            | ✅     | ✅     | ❌        | ❌            | ❌          | ❌        |
| Sanction         | ✅     | ❌     | ✅        | ❌            | ❌          | ❌        |
| Disbursement     | ✅     | ❌     | ❌        | ✅            | ❌          | ❌        |
| Collection       | ✅     | ❌     | ❌        | ❌            | ✅          | ❌        |
| Loan Application | ❌     | ❌     | ❌        | ❌            | ❌          | ✅        |

---

# Environment Variables

Create a `.env.local` file:

```env
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
DOMAIN=http://localhost:3000
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
cd project-folder
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

# Database Seeding

Run the seed endpoint once:

```text
GET /api/seed
```

This creates:

* Admin User
* Sales User
* Sanction User
* Disbursement User
* Collection User
* Borrower User

All with the default password:

```text
password123
```

---

# Authentication

The platform uses:

* JWT Authentication
* HTTP-Only Cookies
* Role-Based Authorization
* Protected Dashboard Routes

---

# Future Enhancements

* Loan Status Tracking
* Document Storage (AWS S3 / Cloudinary)
* Email Notifications
* Admin Analytics Dashboard
* EMI Schedule Generation
* Credit Bureau Integration

---

# Author

**Anuj Verma**

B.Tech, IIIT Bhopal

Full Stack Developer | MERN Stack | Next.js | TypeScript
