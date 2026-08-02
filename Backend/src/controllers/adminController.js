import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import Admin from "../models/Admin.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

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

