import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import calculateFare from "../utils/calculateFare.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import {
  notifyUser,
  notifyDriver,
  notifyAll,
} from "../utils/socketEmit.js";

import { SOCKET_EVENTS } from "../utils/socketEvents.js";

/**
 * =========================
 * CREATE BOOKING (STEP 1)
 * =========================
 */
export const createBooking = async (req, res) => {
  try {
    if (!req.user?.id || req.user.role !== "user") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { pickup, drop } = req.body;
    if (!pickup || !drop) {
      return errorResponse(res, "Pickup and drop are required", 400);
    }

    const distance = Math.floor(Math.random() * 10) + 2;
    const fare = calculateFare(distance);

    const booking = await Booking.create({
      userId: req.user.id,
      pickupLocation: pickup,
      dropLocation: drop,
      distance,
      fare,
      status: "pending",
    });

    return successResponse(res, "Booking created", booking, 201);
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * GET AVAILABLE DRIVERS
 * =========================
 */
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      isAvailable: true,
      isVerified: true,
    }).select("-password");

    return successResponse(res, "Available drivers fetched", drivers);
  } catch (err) {
    console.error("GET DRIVERS ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * ASSIGN DRIVER (USER)
 * =========================
 */
export const assignDriver = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;
    const { driverId } = req.body;

    if (!driverId) {
      return errorResponse(res, "Driver ID is required", 400);
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.driverId) {
      return errorResponse(res, "Driver already assigned", 400);
    }

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.isAvailable) {
      return errorResponse(res, "Driver not available", 400);
    }

    booking.driverId = driverId;
    booking.status = "pending";
    await booking.save();

    driver.isAvailable = false;
    await driver.save();

    // 🔔 Notify driver in real-time
    notifyDriver(
      driverId,
      SOCKET_EVENTS.BOOKING_NEW,
      {
        bookingId: booking._id,
        pickup: booking.pickupLocation,
        drop: booking.dropLocation,
        fare: booking.fare,
      }
    );

    return successResponse(res, "Driver assigned", booking);
  } catch (err) {
    console.error("ASSIGN DRIVER ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER ACTIVE BOOKING
 * =========================
 */
export const getDriverActiveBooking = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const booking = await Booking.findOne({
      driverId: req.user.id,
      status: { $in: ["pending", "accepted", "confirmed", "ongoing"] },
    }).populate("userId", "name email");

    return successResponse(res, "Driver booking fetched", booking);
  } catch (err) {
    console.error("DRIVER ACTIVE ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER ACCEPTS BOOKING
 * =========================
 */
export const driverAcceptBooking = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      driverId: req.user.id,
      status: "pending",
    });

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    booking.status = "accepted";

    await booking.save();

    notifyUser(
      booking.userId,
      SOCKET_EVENTS.BOOKING_ACCEPTED,
      {
          bookingId: booking._id,
          status: "accepted",
          message: "Driver accepted your booking."
      }
    );

    return successResponse(res, "Booking accepted", booking);
  } catch (err) {
    console.error("ACCEPT BOOKING ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER REJECTS BOOKING
 * =========================
 */
export const driverRejectBooking = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      driverId: req.user.id,
      status: { $in: ["pending"] },
    });

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    await Driver.findByIdAndUpdate(req.user.id, {
      isAvailable: true,
    });

    notifyUser(
      booking.userId,
      SOCKET_EVENTS.BOOKING_REJECTED,
      {
        bookingId: booking._id,
        status: "rejected",
        message: "Driver rejected your booking.",
      }
    );

    booking.driverId = null;
    booking.status = "pending";
    await booking.save();

    return successResponse(res, "Booking rejected");
  } catch (err) {
    console.error("REJECT BOOKING ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * COMPLETE BOOKING
 * =========================
 */
export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    booking.status = "completed";
    await booking.save();

    if (booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, {
        isAvailable: true,
      });
    }

    // 🔔 Notify everyone (admin/user refresh)
    notifyUser(
      booking.userId,
      SOCKET_EVENTS.BOOKING_COMPLETED,
      {
        bookingId: booking._id,
        status: "completed",
        message: "Your trip has been completed.",
      }
    );

    return successResponse(res, "Trip completed", booking);
  } catch (err) {
    console.error("COMPLETE BOOKING ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * GET BOOKING BY ID
 * =========================
 */
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("driverId", "name email")
      .populate("userId", "name email");

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    return successResponse(res, "Booking fetched", booking);
  } catch (err) {
    console.error("GET BOOKING ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * USER BOOKING HISTORY
 * =========================
 */
export const getUserBookingHistory = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("driverId", "name email");

    return successResponse(res, "User booking history fetched", bookings);
  } catch (err) {
    console.error("USER HISTORY ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * DRIVER BOOKING HISTORY
 * =========================
 */
export const getDriverBookingHistory = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const bookings = await Booking.find({
      driverId: req.user.id,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    return successResponse(res, "Driver booking history fetched", bookings);
  } catch (err) {
    console.error("DRIVER HISTORY ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};

export const completeRide = async (req, res) => {
  try {
    if (req.user?.role !== "driver") {
      return errorResponse(res, "Unauthorized", 401);
    }

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      driverId: req.user.id,
      status: "ongoing",
    });

    if (!booking) {
      return errorResponse(
        res,
        "Ride not found",
        404
      );
    }

    booking.status = "completed";
    booking.completedAt = new Date();

    await booking.save();

    await Driver.findByIdAndUpdate(
      req.user.id,
      {
        isAvailable: true,
      }
    );

    notifyUser(
      booking.userId,
      SOCKET_EVENTS.RIDE_COMPLETED,
      {
        bookingId: booking._id,
        status: "completed",
        message: "Ride completed successfully.",
      }
    );

    return successResponse(
      res,
      "Ride completed",
      booking
    );

  } catch (err) {
    console.error("COMPLETE RIDE ERROR:", err);
    return errorResponse(res, "Server error", 500);
  }
};