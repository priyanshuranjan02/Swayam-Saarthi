import express from "express";
import {
  registerUser,
  registerDriver,
  login,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * =========================
 * AUTH ROUTES
 * =========================
 */

// User registration
router.post("/register-user", registerUser);

// Driver registration
router.post("/register-driver", registerDriver);

// Login (user / driver / admin)
router.post("/login", login);

export default router;