import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverRole",
    },

    receiverRole: {
      type: String,
      required: true,
      enum: ["User", "Driver", "Admin"],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "booking",
        "payment",
        "ride",
        "review",
        "system",
        "driver",
        "admin",
      ],
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    data: {
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },

      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },

      reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);