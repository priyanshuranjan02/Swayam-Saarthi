# 🚖 Swayam Saarthi – Smart Ride Booking Platform

> A production-ready full-stack ride booking platform connecting Users, Drivers, and Administrators through a seamless, real-time experience.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black?style=for-the-badge&logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)

---

## 🌐 Live Demo

**Frontend:** https://swayam-saarthi.vercel.app

**Backend API:** https://swayam-saarthi-backend.onrender.com

---

# 📖 Overview

Swayam Saarthi is a modern full-stack ride booking platform that enables users to book rides, drivers to accept and manage bookings, and administrators to monitor the entire platform through analytics dashboards.

The application features real-time booking updates using Socket.IO, secure JWT authentication, role-based access control, live ride tracking using Leaflet & OpenStreetMap, payment workflow, reviews, notifications, and an analytics-rich admin dashboard.

---

# ✨ Features

## 👤 User

- Secure Registration & Login
- JWT Authentication
- Create Ride Booking
- Search Pickup & Destination
- Driver Selection
- Secure Payment
- Live Ride Tracking
- Ride History
- Download PDF Receipt
- Notifications
- Rate & Review Drivers

---

## 🚗 Driver

- Driver Registration & Login
- Online / Offline Availability
- Receive Ride Requests
- Accept / Reject Requests
- Real-Time Ride Updates
- Weekly Earnings Dashboard
- Performance Analytics
- Ride History

---

## 🛠 Admin

- Dashboard Analytics
- Revenue Overview
- Booking Statistics
- User Management
- Driver Management
- Payment Monitoring
- Reviews & Ratings
- Platform Activity Monitoring

---

# 🚀 Key Features

✅ Role-Based Authentication

✅ JWT Authorization

✅ Real-Time Booking Updates (Socket.IO)

✅ Live Driver Tracking

✅ Leaflet + OpenStreetMap Integration

✅ Ride Progress Timeline

✅ Payment Workflow

✅ PDF Receipt Generation

✅ Driver Rating & Reviews

✅ Notifications

✅ Responsive UI

✅ Modern Dashboard Analytics

---

# 🏗 System Architecture

```text
                +----------------------+
                |      Frontend        |
                | React + TypeScript   |
                +----------+-----------+
                           |
                    REST APIs / JWT
                           |
                +----------v-----------+
                |   Express Backend    |
                |   Node.js + Socket   |
                +----------+-----------+
                           |
         +-----------------+----------------+
         |                                  |
         |                                  |
+--------v--------+              +----------v---------+
| MongoDB Atlas   |              | Socket.IO Server   |
| Users/Drivers   |              | Real-Time Updates  |
| Bookings        |              | Driver Tracking    |
+-----------------+              +--------------------+
```

---

# 📌 Booking Workflow

```text
User Login
      │
      ▼
Create Booking
      │
      ▼
Select Driver
      │
      ▼
Driver Accepts Ride
      │
      ▼
Payment
      │
      ▼
Live Ride Tracking
      │
      ▼
Ride Completed
      │
      ▼
Rate Driver
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Socket.IO Client
- Leaflet
- OpenStreetMap
- jsPDF
- React Router

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.IO
- Bcrypt
- CORS

---

## Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# 📷 Screenshots

## Landing Page

> *(Add Screenshot)*

---

## User Dashboard

> *(Add Screenshot)*

---

## Driver Dashboard

> *(Add Screenshot)*

---

## Admin Dashboard

> *(Add Screenshot)*

---

## Booking Flow

> *(Add Screenshot)*

---

## Live Ride Tracking

> *(Add Screenshot)*

---

## Payment

> *(Add Screenshot)*

---

## Ride Completed

> *(Add Screenshot)*

---

# 📂 Project Structure

```text
Swayam-Saarthi
│
├── Backend
│   ├── src
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── Frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── contexts
│   ├── hooks
│   ├── services
│   └── assets
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/priyanshuranjan02/Swayam-Saarthi.git
```

---

## Backend

```bash
cd Backend
npm install
npm start
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

Frontend

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

---

# 📈 Future Enhancements

- Google Authentication
- Forgot Password
- Email Verification
- Ride Cancellation Charges
- Surge Pricing
- Promo Coupons
- Multi-language Support
- Driver Documents Verification
- Push Notifications
- Ride Scheduling

---

# 👨‍💻 Author

**Priyanshu Ranjan**

B.Tech Computer Science (AI & ML)

VIT Bhopal University

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

# 📜 License

This project is developed for educational and portfolio purposes.
