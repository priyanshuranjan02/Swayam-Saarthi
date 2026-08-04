import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";

import {
  successResponse,
  errorResponse,
} from "../utils/responseHelper.js";

/**
 * ===================================
 * SUBMIT REVIEW
 * ===================================
 */
export const submitReview = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId, rating, feedback } = req.body;

    if (!bookingId || !rating) {
      return errorResponse(
        res,
        "Booking ID and rating are required",
        400
      );
    }

    // -----------------------------
    // Booking Exists?
    // -----------------------------
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return errorResponse(
        res,
        "Booking not found",
        404
      );
    }

    // -----------------------------
    // Booking completed?
    // -----------------------------
    if (booking.status !== "completed") {
      return errorResponse(
        res,
        "Ride is not completed yet",
        400
      );
    }

    // -----------------------------
    // Already reviewed?
    // -----------------------------
    const existingReview =
      await Review.findOne({
        bookingId,
      });

    if (existingReview) {
      return errorResponse(
        res,
        "Review already submitted",
        400
      );
    }

    // -----------------------------
    // Save Review
    // -----------------------------
    const review =
      await Review.create({
        bookingId,
        userId: req.user.id,
        driverId: booking.driverId,
        rating,
        feedback,
      });

    // -----------------------------
    // Update Driver Rating
    // -----------------------------
    const reviews =
      await Review.find({
        driverId: booking.driverId,
      });

    const totalRating =
      reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      );

    const averageRating =
      totalRating / reviews.length;

    await Driver.findByIdAndUpdate(
      booking.driverId,
      {
        averageRating,
        totalReviews: reviews.length,
      }
    );

    return successResponse(
      res,
      "Review submitted successfully",
      review,
      201
    );

  } catch (err) {

    console.error(
      "SUBMIT REVIEW ERROR:",
      err
    );

    return errorResponse(
      res,
      "Server error",
      500
    );
  }
};