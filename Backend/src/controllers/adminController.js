import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

/**
 * =========================
 * GET ALL DRIVERS
 * =========================
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password");
    return successResponse(res, "Drivers fetched successfully", drivers);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * VERIFY / UNVERIFY DRIVER
 * =========================
 */
export const verifyDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return errorResponse(res, "isVerified must be true or false", 400);
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!driver) {
      return errorResponse(res, "Driver not found", 404);
    }

    return successResponse(
      res,
      `Driver ${isVerified ? "verified" : "unverified"} successfully`,
      driver
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * GET ALL BOOKINGS
 * =========================
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 }) // ✅ recent first
      .populate("userId", "name email phone")
      .populate("driverId", "name email phone");

    return successResponse(res, "Bookings fetched successfully", bookings);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * ADMIN STATS (CARDS)
 * =========================
 */
export const getAdminStats = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDrivers = await Driver.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fare" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return successResponse(res, "Admin stats fetched", {
      users: totalUsers,
      drivers: totalDrivers,
      bookings: totalBookings,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * 📊 ADMIN ANALYTICS (CHARTS)
 * =========================
 */
export const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    // 📈 Daily Revenue (Completed bookings only)
    const dailyRevenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },
    ]);

    // 📊 Daily Bookings Count (All bookings)
    const dailyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    return successResponse(res, "Admin analytics fetched", {
      dailyRevenue,
      dailyBookings,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};