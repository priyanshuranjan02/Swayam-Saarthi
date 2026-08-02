import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

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