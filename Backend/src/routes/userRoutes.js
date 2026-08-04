import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    getProfile,
    updateProfile,
    changePassword,
    getDashboardStats,
    getCurrentRide,
    getRecentTrips,
    getRideAnalytics
} from "../controllers/userController.js";

const router = express.Router();

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
  "/dashboard-stats",
  authMiddleware,
  roleMiddleware("user"),
  getDashboardStats
);

router.get(
  "/current-ride",
  authMiddleware,
  roleMiddleware("user"),
  getCurrentRide
);

router.get(
  "/recent-trips",
  authMiddleware,
  roleMiddleware("user"),
  getRecentTrips
);

router.get(
  "/ride-analytics",
  authMiddleware,
  roleMiddleware("user"),
  getRideAnalytics
);

export default router;