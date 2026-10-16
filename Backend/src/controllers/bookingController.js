import { isValidObjectId } from "../utils/objectIdValidator.js";
import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import {
  notifyUser,
  notifyDriver,
  notifyAll,
} from "../utils/socketEmit.js";

import { SOCKET_EVENTS } from "../utils/socketEvents.js";
import {
  createNotification,
} from "../services/notificationService.js";

/**
 * =========================
 * CREATE BOOKING (STEP 1)
 * =========================
 */
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

    const {
      pickup,
      drop,
      pickupLocation,
      dropLocation,
      routeDistance,
      routeDuration,
      fare,
    } = req.body;

    if (!pickup || !drop) {
      return errorResponse(
        res,
        "Pickup and drop are required",
        400
      );
    }

    const booking = await Booking.create({
      userId: req.user.id,

      pickup,
      drop,

      pickupLocation,
      dropLocation,

      routeDistance,
      routeDuration,

      fare,

      status: "pending",
    });

    return successResponse(
      res,
      "Booking created",
      booking,
      201
    );

  } catch (err) {

    console.error(
      "CREATE BOOKING ERROR:",
      err
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
 * GET AVAILABLE DRIVERS
 * =========================
 */
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      isAvailable: true,
      isVerified: true,
    })
    .select("-password")
    .select(
      "name email averageRating totalReviews isVerified"
    );

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

    // Validate the booking ID before querying MongoDB.
    if (!isValidObjectId(bookingId)) {
      return errorResponse(res, "Invalid booking ID", 400);
    }

    // Preserve the existing missing-driver validation.
    if (!driverId) {
      return errorResponse(res, "Driver ID is required", 400);
    }

    // Validate the driver ID before querying MongoDB.
    if (!isValidObjectId(driverId)) {
      return errorResponse(res, "Invalid driver ID", 400);
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

    await createNotification({
      receiverId: driver._id,
      receiverRole: "Driver",

      title: "New Booking Request",

      message: `${req.user.name} requested a ride.`,

      type: "booking",

      data: {
        bookingId: booking._id,
      },
    });

    driver.isAvailable = false;
    await driver.save();

    // 🔔 Notify driver in real-time
    notifyDriver(
      driverId,
      SOCKET_EVENTS.BOOKING_NEW,
      {
        bookingId: booking._id,
        pickup: booking.pickupLocation?.name || booking.pickup,
        drop: booking.dropLocation?.name || booking.drop,
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

    // Update booking status
    booking.status = "accepted";
    await booking.save();

    // Create notification for user
    await createNotification({
      receiverId: booking.userId,
      receiverRole: "User",

      title: "Driver Accepted",

      message: `${req.user.name} accepted your booking.`,

      type: "ride",

      data: {
        bookingId: booking._id,
      },
    });

    // Notify user via socket
    notifyUser(
      booking.userId,
      SOCKET_EVENTS.BOOKING_ACCEPTED,
      {
        bookingId: booking._id.toString(),
        status: "accepted",
        message: "Driver accepted your booking.",
      }
    );

    console.log(
      "✅ BOOKING_ACCEPTED emitted to user:",
      booking.userId.toString()
    );

    return successResponse(
      res,
      "Booking accepted",
      booking
    );

  } catch (err) {
    console.error("ACCEPT BOOKING ERROR:", err);
    return errorResponse(
      res,
      "Server error",
      500
    );
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


    console.log("================================");
    console.log("RIDE COMPLETED");
    console.log("User Room :", booking.userId.toString());
    console.log("Booking   :", booking._id.toString());
    console.log("================================");


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

    const updatedBooking = await Booking.findById(
        booking._id
    );

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
            bookingId: updatedBooking._id.toString(),
            status: updatedBooking.status,
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


export const updateDriverLocation = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const {
            latitude,
            longitude,
        } = req.body;

        const booking =
            await Booking.findById(
                bookingId
            );

        if (!booking) {
            return errorResponse(
                res,
                "Booking not found",
                404
            );
        }

        booking.driverCurrentLocation = {
            lat: latitude,
            lng: longitude,
            updatedAt: new Date(),
        };

        await booking.save();

        return successResponse(
            res,
            "Location updated"
        );
    } catch (err) {
        console.error(
            "UPDATE LOCATION ERROR",
            err
        );

        return errorResponse(
            res,
            "Server Error",
            500
        );
    }
};