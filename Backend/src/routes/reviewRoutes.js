import express from "express";

import { submitReview } from "../controllers/reviewController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==========================
 * USER SUBMITS REVIEW
 * ==========================
 */
router.post(
  "/",
  verifyToken,
  submitReview
);

export default router;