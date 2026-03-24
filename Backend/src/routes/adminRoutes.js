import express from "express";
import {
  getAllDrivers,
  verifyDriver,
  getAllBookings,
  getAdminStats,
  getAdminAnalytics
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// 📊 Admin dashboard stats
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminStats
);

// 👨‍✈️ View all drivers
router.get(
  "/drivers",
  authMiddleware,
  roleMiddleware("admin"),
  getAllDrivers
);

// ✅ Verify / Unverify driver
router.put(
  "/verify-driver/:driverId",
  authMiddleware,
  roleMiddleware("admin"),
  verifyDriver
);

// 📦 View all bookings
router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("admin"),
  getAllBookings
);

router.get(
  "/analytics", 
  authMiddleware, 
  roleMiddleware("admin"), 
  getAdminAnalytics
);

export default router;