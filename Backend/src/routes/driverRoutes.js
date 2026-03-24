import express from "express";
import protect from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDriverProfile,
  updateAvailability,
  getPendingBookings,
  acceptBooking,
  rejectBooking,
  getActiveBooking,
  getDriverEarningsAnalytics,
  getDriverEarnings
} from "../controllers/driverController.js";

const router = express.Router();

/**
 * =========================
 * DRIVER ROUTES
 * =========================
 */

// 🔹 Driver profile
router.get(
  "/profile",
  protect,
  roleMiddleware("driver"),
  getDriverProfile
);

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

// 🔹 Accept booking
router.post(
  "/bookings/accept/:bookingId",
  protect,
  roleMiddleware("driver"),
  acceptBooking
);

// 🔹 Reject booking
router.post(
  "/bookings/reject/:bookingId",
  protect,
  roleMiddleware("driver"),
  rejectBooking
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
  getDriverEarningsAnalytics
);

router.get(
  "/earnings",
  authMiddleware,
  roleMiddleware("driver"),
  getDriverEarnings
);

export default router;