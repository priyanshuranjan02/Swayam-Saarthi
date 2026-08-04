import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import {
  notifyUser,
} from "../utils/socketEmit.js";

import {
  SOCKET_EVENTS,
} from "../utils/socketEvents.js";

/**
 * =========================
 * GET DRIVER PROFILE
 * =========================
 */
// export const getDriverProfile = async (req, res) => {
//   try {
//     if (!req.user || req.user.role !== "driver") {
//       return errorResponse(res, "Unauthorized", 401);
//     }

//     const driver = await Driver.findById(req.user.id).select("-password");

//     if (!driver) {
//       return errorResponse(res, "Driver not found", 404);
//     }

//     return successResponse(res, "Driver profile fetched", driver);
//   } catch (error) {
//     console.error("GET DRIVER PROFILE ERROR:", error);
//     return errorResponse(res, "Server error", 500);
//   }
// };

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
      status: {
        $in: [
          "accepted",
          "confirmed",
          "ongoing",
        ],
      },
    }).populate("userId", "name email");

    return successResponse(res, "Active booking fetched", booking);
  } catch (error) {
    console.error("GET ACTIVE BOOKING ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const startRide = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      driverId: req.user.id,
      status: "confirmed",
    });

    if (!booking) {
      return errorResponse(
        res,
        "Booking not ready to start",
        404
      );
    }

    booking.status = "ongoing";
    booking.startedAt = new Date();

    await booking.save();

    notifyUser(
      booking.userId,
      SOCKET_EVENTS.RIDE_STARTED,
      {
        bookingId: booking._id,
        status: "ongoing",
        message: "Your ride has started.",
      }
    );

    return successResponse(
      res,
      "Ride started successfully",
      booking
    );

  } catch (err) {
    console.error("START RIDE ERROR:", err);
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


export const getProfile = async (req, res) => {
  try {
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


export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    if (name) driver.name = name;

    if (phone !== undefined) {
      driver.phone = phone;
    }

    await driver.save();

    return successResponse(res, "Profile updated", {
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      isVerified: driver.isVerified,
      isAvailable: driver.isAvailable,
    });

  } catch (error) {
    console.error("UPDATE DRIVER PROFILE ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    const isMatch = await comparePassword(
      currentPassword,
      driver.password
    );

    if (!isMatch) {
      return errorResponse(res, "Current password incorrect", 400);
    }

    driver.password = await hashPassword(newPassword);

    await driver.save();

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    console.error("CHANGE DRIVER PASSWORD ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};


/**
 * =====================================
 * DRIVER DASHBOARD ANALYTICS
 * =====================================
 */

export const getDriverDashboard = async (req, res) => {
  try {

    if (!req.user || req.user.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const driver = await Driver.findById(req.user.id)
      .select("-password");

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    const completedTrips = await Booking.find({
      driverId: driver._id,
      status: "completed",
    });

    const activeRide = await Booking.findOne({
      driverId: driver._id,
      status: {
        $in: ["pending", "accepted", "confirmed", "ongoing"],
      },
    }).populate("userId", "name email");

    const totalEarnings = completedTrips.reduce(
      (sum, booking) => sum + (booking.fare || 0),
      0
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayEarnings = completedTrips
      .filter((trip) => trip.createdAt >= today)
      .reduce(
        (sum, trip) => sum + (trip.fare || 0),
        0
      );

    const averageFare =
      completedTrips.length > 0
        ? Math.round(
            totalEarnings / completedTrips.length
          )
        : 0;

    return successResponse(
      res,
      "Driver dashboard fetched",
      {
        profile: driver,

        stats: {
          todayEarnings,
          totalEarnings,
          completedTrips:
            completedTrips.length,

          averageFare,

          averageRating:
            driver.averageRating,

          totalReviews:
            driver.totalReviews,
        },

        activeRide,
      }
    );

  } catch (err) {

    console.error(
      "DRIVER DASHBOARD ERROR:",
      err
    );

    return errorResponse(
      res,
      "Server error",
      500
    );

  }
};


export const getWeeklyEarnings = async (req, res) => {
  try {
    const driverId = req.user.id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      driverId,
      status: "completed",
      completedAt: { $gte: sevenDaysAgo },
    });

    const weeklyMap = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = d.toISOString().split("T")[0];

      weeklyMap[key] = 0;
    }

    bookings.forEach((booking) => {
      const key = booking.completedAt
        .toISOString()
        .split("T")[0];

      if (weeklyMap[key] !== undefined) {
        weeklyMap[key] += booking.fare;
      }
    });

    const chart = Object.keys(weeklyMap)
      .sort()
      .map((date) => ({
        date,
        earnings: weeklyMap[date],
      }));

    return successResponse(
      res,
      "Weekly earnings",
      chart
    );
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      "Server Error",
      500
    );
  }
};