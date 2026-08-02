import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },

    distance: {
      type: Number,
      default: 0,
    },

    fare: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
          "pending",      // Waiting for driver
          "accepted",     // Driver accepted
          "confirmed",    // Payment completed
          "ongoing",      // Ride started
          "completed",    // Ride finished
          "rejected",     // Driver rejected
          "cancelled"
      ],
      default: "pending"
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);