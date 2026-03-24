import express from "express";
import { makePayment } from "../controllers/paymentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =========================
 * PAYMENT ROUTES
 * =========================
 */

router.post(
  "/pay",
  authMiddleware,
  roleMiddleware("user"),
  makePayment
);

export default router;