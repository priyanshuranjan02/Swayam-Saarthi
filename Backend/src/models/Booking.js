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

    pickup: {
      type: String,
      required: true,
      trim: true,
    },

    drop: {
      type: String,
      required: true,
      trim: true,
    },

    pickupLocation: {
      name: String,
      lat: Number,
      lon: Number,
    },

    dropLocation: {
      name: String,
      lat: Number,
      lon: Number,
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

    routeDistance: {
        type: Number,
        default: 0
    },
    
    routeDuration: {
        type: Number,
        default: 0
    },

    driverCurrentLocation: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },
    },
    
    fare: {
        type: Number,
        default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);