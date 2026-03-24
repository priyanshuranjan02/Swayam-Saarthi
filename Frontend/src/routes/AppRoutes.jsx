import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";

import UserDashboard from "../pages/UserDashboard";
import DriverDashboard from "../pages/DriverDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import CreateBooking from "../pages/CreateBooking";
import SelectDriver from "../pages/SelectDriver";
import Payment from "../pages/Payment";
import BookingConfirmation from "../pages/BookingConfirmation";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* PUBLIC ROUTES */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register/:role" element={<Register />} />
    <Route path="/about" element={<About />} />

    {/* USER ROUTES */}
    <Route
      path="/user"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/create-booking"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <CreateBooking />
        </ProtectedRoute>
      }
    />

    {/* 🔥 STEP 2: SELECT DRIVER (BOOKING ID REQUIRED) */}
    <Route
      path="/select-driver/:bookingId"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <SelectDriver />
        </ProtectedRoute>
      }
    />

    {/* 🔥 STEP 3: BOOKING CONFIRMATION */}
    <Route
      path="/booking-confirmation/:bookingId"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <BookingConfirmation />
        </ProtectedRoute>
      }
    />

    {/* PAYMENT */}
    <Route
      path="/payment/:bookingId"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <Payment />
        </ProtectedRoute>
      }
    />

    {/* DRIVER ROUTES */}
    <Route
      path="/driver"
      element={
        <ProtectedRoute allowedRoles={["driver"]}>
          <DriverDashboard />
        </ProtectedRoute>
      }
    />

    {/* ADMIN ROUTES */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;