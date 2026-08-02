import express from "express";
import {
  createBooking,
  getAvailableDrivers,
  assignDriver,
  completeBooking,
  getDriverActiveBooking,
  driverAcceptBooking,
  driverRejectBooking,
  getBookingById,
  getUserBookingHistory,
  getDriverBookingHistory,
  completeRide,
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =========================
 * USER ROUTES
 * =========================
 */

// Step 1: Create booking
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("user"),
  createBooking
);

// Step 2: Get available drivers
router.get(
  "/drivers",
  authMiddleware,
  roleMiddleware("user"),
  getAvailableDrivers
);

// Step 2 → 3: Assign driver
router.post(
  "/assign/:bookingId",
  authMiddleware,
  roleMiddleware("user"),
  assignDriver
);

// ✅ User booking history
router.get(
  "/user",
  authMiddleware,
  roleMiddleware("user"),
  getUserBookingHistory
);

// Complete booking
router.put(
  "/complete/:bookingId",
  authMiddleware,
  roleMiddleware("user", "driver"),
  completeBooking
);

/**
 * =========================
 * DRIVER ROUTES
 * =========================
 */

// Driver accepts booking
router.post(
  "/driver/accept/:bookingId",
  authMiddleware,
  roleMiddleware("driver"),
  driverAcceptBooking
);

// Driver rejects booking
router.post(
  "/driver/reject/:bookingId",
  authMiddleware,
  roleMiddleware("driver"),
  driverRejectBooking
);

// Driver active trip
router.get(
  "/driver/active",
  authMiddleware,
  roleMiddleware("driver"),
  getDriverActiveBooking
);

// ✅ Driver booking history
router.get(
  "/driver/history",
  authMiddleware,
  roleMiddleware("driver"),
  getDriverBookingHistory
);

// Get booking by ID (KEEP THIS LAST)
router.get(
  "/:bookingId",
  authMiddleware,
  roleMiddleware("user", "driver"),
  getBookingById
);

router.patch(
  "/complete/:bookingId",
  authMiddleware,
  roleMiddleware("driver"),
  completeRide
);

export default router;