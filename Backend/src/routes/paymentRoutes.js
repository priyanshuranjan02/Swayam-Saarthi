import express from "express";
import { makePayment, getReceipt } from "../controllers/paymentController.js";

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

router.get(
  "/receipt/:bookingId",
  authMiddleware,
  getReceipt
);

export default router;