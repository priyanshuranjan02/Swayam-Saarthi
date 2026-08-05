import express from "express";
import { getLandingData } from "../controllers/publicController.js";

const router = express.Router();

/**
 * ===================================
 * PUBLIC ROUTES
 * ===================================
 * These routes do not require authentication.
 * They are used for the landing page.
 */

// Landing page statistics & testimonials
router.get("/landing", getLandingData);

export default router;