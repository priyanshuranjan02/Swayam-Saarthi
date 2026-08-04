import express from "express";
import {
  getAllDrivers,
  verifyDriver,
  getAllBookings,
  getAdminStats,
  getAdminAnalytics,
  getProfile,
  updateProfile,
  changePassword,
  getTopDrivers,
  getLatestReviews,
  getRecentPayments,
  getSystemActivity,
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

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.get(
  "/top-drivers",
  authMiddleware,
  roleMiddleware("admin"),
  getTopDrivers
);

router.get(
  "/reviews",
  authMiddleware,
  roleMiddleware("admin"),
  getLatestReviews
);

router.get(
  "/payments",
  authMiddleware,
  roleMiddleware("admin"),
  getRecentPayments
);

router.get(
  "/activity",
  authMiddleware,
  roleMiddleware("admin"),
  getSystemActivity
);

export default router;