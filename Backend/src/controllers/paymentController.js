import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

/**
 * =========================
 * MOCK PAYMENT
 * =========================
 */
export const makePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId) {
      return errorResponse(res, "Booking ID is required", 400);
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.status !== "completed") {
      return errorResponse(res, "Complete the trip before payment", 400);
    }

    const payment = await Payment.create({
      bookingId,
      userId,
      amount: booking.fare,
      paymentMethod: paymentMethod || "cash",
      status: "success",
    });

    return successResponse(res, "Payment successful", payment, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};