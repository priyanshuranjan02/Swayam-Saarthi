import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // phone: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
    },

    role: {
      type: String,
      default: "driver",
    },

    rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;