import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

/**
 * =========================
 * GET DRIVER PROFILE
 * =========================
 */
export const getDriverProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const driver = await Driver.findById(req.user.id).select("-password");

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    return successResponse(res, "Driver profile fetched", driver);
  } catch (error) {
    console.error("GET DRIVER PROFILE ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * TOGGLE DRIVER AVAILABILITY
 * =========================
 */
export const updateAvailability = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return errorResponse(res, "Invalid availability value", 400);
    }

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { isAvailable },
      { new: true }
    );

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    return successResponse(res, "Availability updated", driver);
  } catch (error) {
    console.error("UPDATE AVAILABILITY ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * GET PENDING BOOKING REQUESTS
 * =========================
 */
export const getPendingBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const bookings = await Booking.find({
      status: "pending",
      driverId: null
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return successResponse(res, "Pending bookings fetched", bookings);
  } catch (error) {
    console.error("GET PENDING BOOKINGS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER ACCEPTS BOOKING
 * =========================
 */
export const acceptBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      status: "pending",
      driverId: null
    });

    if (!booking) {
      return errorResponse(res, "Booking not available", 404);
    }

    booking.driverId = req.user.id;
    booking.status = "ongoing";
    await booking.save();

    await Driver.findByIdAndUpdate(req.user.id, {
      isAvailable: false
    });

    return successResponse(res, "Booking accepted", booking);
  } catch (error) {
    console.error("ACCEPT BOOKING ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER REJECTS BOOKING
 * =========================
 */
export const rejectBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    return successResponse(res, "Booking rejected");
  } catch (error) {
    console.error("REJECT BOOKING ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * GET DRIVER ACTIVE BOOKING
 * =========================
 */
export const getActiveBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const booking = await Booking.findOne({
      driverId: req.user.id,
      status: "ongoing"
    }).populate("userId", "name email");

    return successResponse(res, "Active booking fetched", booking);
  } catch (error) {
    console.error("GET ACTIVE BOOKING ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * 🚀 DRIVER EARNINGS ANALYTICS
 * =========================
 */
export const getDriverEarningsAnalytics = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const driverId = req.user.id;

    // Total earnings + trips
    const completedBookings = await Booking.find({
      driverId,
      status: "completed"
    });

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + booking.fare,
      0
    );

    const totalTrips = completedBookings.length;

    // 📊 Daily earnings aggregation
    const dailyEarnings = await Booking.aggregate([
      {
        $match: {
          driverId: driverId,
          status: "completed"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          earnings: { $sum: "$fare" },
          trips: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return successResponse(res, "Driver earnings analytics fetched", {
      totalEarnings,
      totalTrips,
      dailyEarnings
    });
  } catch (error) {
    console.error("DRIVER EARNINGS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER EARNINGS ANALYTICS
 * =========================
 */

export const getDriverEarnings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const driverId = req.user.id;

    /* ================= TOTAL + COUNT ================= */
    const summary = await Booking.aggregate([
      {
        $match: {
          driverId,
          status: "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$fare" },
          completedTrips: { $sum: 1 }
        }
      }
    ]);

    const totalEarnings = summary[0]?.totalEarnings || 0;
    const completedTrips = summary[0]?.completedTrips || 0;

    /* ================= DAILY EARNINGS ================= */
    const dailyEarnings = await Booking.aggregate([
      {
        $match: {
          driverId,
          status: "completed"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          earnings: { $sum: "$fare" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedDaily = dailyEarnings.map((d) => ({
      date: d._id,
      earnings: d.earnings
    }));

    /* ================= RESPONSE ================= */
    return successResponse(res, "Driver earnings analytics fetched", {
      totalEarnings,
      completedTrips,
      dailyEarnings: formattedDaily
    });

  } catch (error) {
    console.error("DRIVER EARNINGS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};