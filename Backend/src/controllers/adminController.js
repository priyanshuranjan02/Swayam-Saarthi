import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import Admin from "../models/Admin.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";

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
 * ADMIN STATS (ENHANCED KPI CARDS)
 * =========================
 */
export const getAdminStats = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // =========================
    // TOTAL COUNTS
    // =========================

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalDrivers =
      await Driver.countDocuments();

    const totalBookings =
      await Booking.countDocuments();

    // =========================
    // NEW USERS THIS MONTH
    // =========================

    const newUsersThisMonth =
      await User.countDocuments({
        role: "user",
        createdAt: {
          $gte: startOfMonth,
        },
      });

    // =========================
    // ONLINE DRIVERS
    // =========================

    const onlineDrivers =
      await Driver.countDocuments({
        isAvailable: true,
      });

    // =========================
    // TODAY BOOKINGS
    // =========================

    const todayBookings =
      await Booking.countDocuments({
        createdAt: {
          $gte: startOfToday,
        },
      });

    // =========================
    // TOTAL REVENUE
    // =========================

    const revenueResult =
      await Booking.aggregate([
        {
          $match: {
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$fare",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    // =========================
    // TODAY REVENUE
    // =========================

    const todayRevenueResult =
      await Booking.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: {
              $gte: startOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$fare",
            },
          },
        },
      ]);

    const todayRevenue =
      todayRevenueResult[0]?.totalRevenue || 0;

    // =========================
    // RESPONSE
    // =========================

    return successResponse(
      res,
      "Admin stats fetched",
      {
        users: totalUsers,

        drivers: totalDrivers,

        bookings: totalBookings,

        revenue: totalRevenue,

        newUsersThisMonth,

        onlineDrivers,

        todayBookings,

        todayRevenue,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN STATS ERROR:",
      error
    );

    return errorResponse(
      res,
      "Server error",
      500
    );
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

    // =========================
    // 🥧 Booking Status Distribution
    // =========================

    const bookingStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    return successResponse(
      res,
      "Admin analytics fetched",
      {
        dailyRevenue,
        dailyBookings,
        bookingStatus,
      }
    );
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * 🏆 TOP DRIVERS LEADERBOARD
 * =========================
 */
export const getTopDrivers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const topDrivers = await Driver.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "driverId",
          as: "bookings",
        },
      },

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "driverId",
          as: "reviews",
        },
      },

      {
        $project: {
          name: 1,
          email: 1,

          completedTrips: {
            $size: {
              $filter: {
                input: "$bookings",
                as: "booking",
                cond: {
                  $eq: [
                    "$$booking.status",
                    "completed",
                  ],
                },
              },
            },
          },

          totalEarnings: {
            $sum: "$bookings.fare",
          },

          averageRating: {
            $ifNull: [
              {
                $avg: "$reviews.rating",
              },
              0,
            ],
          },
        },
      },

      {
        $sort: {
          completedTrips: -1,
          totalEarnings: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    return successResponse(
      res,
      "Top drivers fetched",
      topDrivers
    );

  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      "Server error",
      500
    );
  }
};

/**
 * =========================
 * ⭐ LATEST REVIEWS
 * =========================
 */
export const getLatestReviews = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate("driverId", "name");

    return successResponse(
      res,
      "Latest reviews fetched",
      reviews
    );

  } catch (error) {
    console.error("LATEST REVIEWS ERROR:", error);

    return errorResponse(
      res,
      "Server error",
      500
    );
  }
};

/**
 * =========================
 * 💳 RECENT PAYMENTS
 * =========================
 */
export const getRecentPayments = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate({
        path: "bookingId",
        populate: {
          path: "driverId",
          select: "name",
        },
      });

    return successResponse(
      res,
      "Recent payments fetched",
      payments
    );

  } catch (error) {
    console.error(
      "RECENT PAYMENTS ERROR:",
      error
    );

    return errorResponse(
      res,
      "Server error",
      500
    );
  }
};

/**
 * =========================
 * 📡 SYSTEM ACTIVITY FEED
 * =========================
 */
export const getSystemActivity = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate("driverId", "name");

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name");

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate("driverId", "name");

    const drivers = await Driver.find()
      .sort({ updatedAt: -1 })
      .limit(5);

    const activities = [];

    bookings.forEach((booking) => {
      activities.push({
        type: "booking",
        message: `${booking.userId?.name ?? "User"} created a booking`,
        createdAt: booking.createdAt,
      });

      if (booking.status === "completed") {
        activities.push({
          type: "ride",
          message: `Ride completed by ${booking.driverId?.name ?? "Driver"}`,
          createdAt: booking.updatedAt,
        });
      }
    });

    payments.forEach((payment) => {
      activities.push({
        type: "payment",
        message: `₹${payment.amount} payment received`,
        createdAt: payment.createdAt,
      });
    });

    reviews.forEach((review) => {
      activities.push({
        type: "review",
        message: `${review.userId?.name ?? "User"} rated ${review.driverId?.name ?? "Driver"} (${review.rating}★)`,
        createdAt: review.createdAt,
      });
    });

    drivers.forEach((driver) => {
      activities.push({
        type: "driver",
        message: `${driver.name} is ${
          driver.isAvailable ? "Online" : "Offline"
        }`,
        createdAt: driver.updatedAt,
      });
    });

    activities.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return successResponse(
      res,
      "System activity fetched",
      activities.slice(0, 15)
    );

  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      "Server error",
      500
    );
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    return successResponse(res, "Admin profile fetched", admin);
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    if (name) admin.name = name;

    if (phone !== undefined) {
      admin.phone = phone;
    }

    await admin.save();

    return successResponse(res, "Profile updated", {
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    });
  } catch (error) {
    console.error("UPDATE ADMIN PROFILE ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    const isMatch = await comparePassword(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return errorResponse(res, "Current password incorrect", 400);
    }

    admin.password = await hashPassword(newPassword);

    await admin.save();

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    console.error("CHANGE ADMIN PASSWORD ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};