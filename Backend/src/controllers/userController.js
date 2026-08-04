import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import Booking from "../models/Booking.js";

// ==========================
// Get Profile
// ==========================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Profile fetched successfully", user);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

// ==========================
// Update Profile
// ==========================

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return successResponse(res, "Profile updated", {
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

// ==========================
// Change Password
// ==========================

export const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const match = await comparePassword(
      currentPassword,
      user.password
    );

    if (!match) {
      return errorResponse(res, "Current password incorrect", 400);
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    return successResponse(res, "Password changed successfully");

  } catch (err) {

    console.error(err);

    return errorResponse(res, "Server error", 500);

  }

};


/**
 * =========================
 * USER DASHBOARD STATS
 * =========================
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      userId,
      status: "completed",
    }).populate("driverId", "name");

    const totalTrips = bookings.length;

    const moneySpent = bookings.reduce(
      (sum, booking) => sum + (booking.fare || 0),
      0
    );

    const averageFare =
      totalTrips > 0
        ? Math.round(moneySpent / totalTrips)
        : 0;

    // Favorite Driver
    const driverCount = {};

    bookings.forEach((booking) => {
      if (!booking.driverId) return;

      const id = booking.driverId._id.toString();

      if (!driverCount[id]) {
        driverCount[id] = {
          name: booking.driverId.name,
          trips: 0,
        };
      }

      driverCount[id].trips++;
    });

    let favoriteDriver = null;

    Object.values(driverCount).forEach((driver) => {
      if (
        !favoriteDriver ||
        driver.trips > favoriteDriver.trips
      ) {
        favoriteDriver = driver;
      }
    });

    return successResponse(
      res,
      "Dashboard stats fetched",
      {
        totalTrips,
        moneySpent,
        averageFare,
        favoriteDriver,
      }
    );
  } catch (error) {
    console.error(
      "USER DASHBOARD STATS ERROR:",
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
 * CURRENT ACTIVE RIDE
 * =========================
 */
export const getCurrentRide = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.user.id,
      status: {
        $in: [
          "pending",
          "accepted",
          "ongoing",
        ],
      },
    })
      .sort({ createdAt: -1 })
      .populate("driverId", "name")

    return successResponse(
      res,
      "Current ride fetched",
      booking
    );

  } catch (error) {
    console.error(
      "CURRENT RIDE ERROR:",
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
 * RECENT TRIPS PREVIEW
 * =========================
 */
export const getRecentTrips = async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.user.id,
      status: "completed",
    })
      .sort({ completedAt: -1 })
      .limit(3)
      .populate("driverId", "name");

    return successResponse(
      res,
      "Recent trips fetched",
      bookings
    );

  } catch (error) {

    console.error(
      "RECENT TRIPS ERROR:",
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
 * USER RIDE ANALYTICS
 * =========================
 */
export const getRideAnalytics = async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.user.id,
      status: "completed",
    });

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlySpending = 0;

    let longestRide = 0;

    let totalDuration = 0;

    const destinationCount = {};

    bookings.forEach((booking) => {

      if (
        booking.completedAt &&
        booking.completedAt.getMonth() === currentMonth &&
        booking.completedAt.getFullYear() === currentYear
      ) {
        monthlySpending += booking.fare || 0;
      }

      longestRide = Math.max(
        longestRide,
        booking.routeDistance || 0
      );

      totalDuration += booking.routeDuration || 0;

      const destination =
        booking.dropLocation?.name;

      if (destination) {
        destinationCount[destination] =
          (destinationCount[destination] || 0) + 1;
      }

    });

    let mostVisited = "--";
    let maxVisits = 0;

    Object.entries(destinationCount).forEach(
      ([name, count]) => {

        if (count > maxVisits) {
          maxVisits = count;
          mostVisited = name;
        }

      }
    );

    const averageDuration =
      bookings.length > 0
        ? Math.round(
            totalDuration / bookings.length
          )
        : 0;

    return successResponse(
      res,
      "Ride analytics fetched",
      {
        monthlySpending,
        longestRide,
        averageDuration,
        mostVisited,
      }
    );

  } catch (error) {

    console.error(
      "RIDE ANALYTICS ERROR:",
      error
    );

    return errorResponse(
      res,
      "Server error",
      500
    );

  }
};