import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { notifyDriver } from "../utils/socketEmit.js";
import { SOCKET_EVENTS } from "../utils/socketEvents.js";

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

    if (booking.status !== "accepted") {
      return errorResponse(
        res,
        "Booking is not ready for payment",
        400
      );
    }

    const payment = await Payment.create({
      bookingId,
      userId,
      amount: booking.fare,
      paymentMethod: paymentMethod || "upi",
      status: "success",
    });

    booking.status = "confirmed";
    await booking.save();

    notifyDriver(
      booking.driverId,
      SOCKET_EVENTS.PAYMENT_CONFIRMED,
      {
        bookingId: booking._id,
        message: "Customer completed the payment.",
      }
    );

    return successResponse(res, "Payment successful", payment, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};