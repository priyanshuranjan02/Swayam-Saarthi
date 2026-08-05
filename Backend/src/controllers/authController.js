import User from "../models/User.js";
import Driver from "../models/Driver.js";
import Admin from "../models/Admin.js";

import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

/**
 * =========================
 * REGISTER USER
 * =========================
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    
    // Only add phone if it was provided
    if (phone && phone.trim() !== "") {
      userData.phone = phone.trim();
    }
    
    const user = await User.create(userData);

    const token = generateToken(user._id, user.role);

    return successResponse(
      res,
      "User registered successfully",
      {
        token,
        account: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    console.error("REGISTER USER ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * REGISTER DRIVER
 * =========================
 */
export const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return errorResponse(res, "Driver already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    const driverData = {
      name,
      email,
      password: hashedPassword,
      role: "driver",
      isVerified: true,
      isAvailable: false,
    };
    
    // Only include phone if it was provided
    if (phone && phone.trim() !== "") {
      driverData.phone = phone.trim();
    }

    const driver = await Driver.create(driverData);

    const token = generateToken(driver._id, driver.role);

    return successResponse(
      res,
      "Driver registered successfully",
      {
        token,
        user: {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          role: driver.role
        }
      },
      201
    );
  } catch (error) {
    console.error("REGISTER DRIVER ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};

/**
 * =========================
 * LOGIN (USER / DRIVER / ADMIN)
 * =========================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    // 🔍 Check all roles
    let account =
      (await User.findOne({ email })) ||
      (await Driver.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!account) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isMatch = await comparePassword(password, account.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = generateToken(account._id, account.role);

    return successResponse(res, "Login successful", {
      token,
      account: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return errorResponse(res, "Server error", 500);
  }
};