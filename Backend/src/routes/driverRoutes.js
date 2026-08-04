import express from "express";
import protect from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateAvailability,
  getPendingBookings,
  getActiveBooking,
  getDriverEarningsAnalytics,
  getDriverEarnings,
  getProfile,
  updateProfile,
  changePassword,
  startRide,
  getDriverDashboard,
  getWeeklyEarnings,
} from "../controllers/driverController.js";

const router = express.Router();

/**
 * =========================
 * DRIVER ROUTES
 * =========================
 */

// 🔹 Toggle availability (online / offline)
router.patch(
  "/availability",
  protect,
  roleMiddleware("driver"),
  updateAvailability
);

// 🔹 Get pending booking requests (Accept / Reject)
router.get(
  "/bookings/pending",
  protect,
  roleMiddleware("driver"),
  getPendingBookings
);

// 🔹 Get active booking (accepted)
router.get(
  "/bookings/active",
  protect,
  roleMiddleware("driver"),
  getActiveBooking
);

router.get(
  "/earnings",
  authMiddleware,
  roleMiddleware("driver"),
  getDriverEarnings
);

router.get(
  "/earnings/analytics",
  authMiddleware,
  roleMiddleware("driver"),
  getDriverEarningsAnalytics
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("driver"),
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("driver"),
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  roleMiddleware("driver"),
  changePassword
);

router.patch(
  "/booking/:bookingId/start",
  authMiddleware,
  roleMiddleware("driver"),
  startRide
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("driver"),
    getDriverDashboard
);

router.get(
  "/weekly-earnings",
  authMiddleware,
  roleMiddleware("driver"),
  getWeeklyEarnings
);

export default router;