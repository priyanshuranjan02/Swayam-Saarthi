import Notification from "../models/Notification.js";
import {
  successResponse,
  errorResponse,
} from "../utils/responseHelper.js";

/**
 * =========================
 * GET USER NOTIFICATIONS
 * =========================
 */
export const getNotifications = async (
  req,
  res
) => {
  try {
    const roleMap = {
      user: "User",
      driver: "Driver",
      admin: "Admin",
    };

    const notifications =
      await Notification.find({
        receiverId: req.user.id,
        receiverRole:
          roleMap[req.user.role],
      }).sort({
        createdAt: -1,
      });

    return successResponse(
      res,
      "Notifications fetched",
      notifications
    );
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
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
 * UNREAD COUNT
 * =========================
 */
export const getUnreadCount =
  async (req, res) => {
    try {
      const roleMap = {
        user: "User",
        driver: "Driver",
        admin: "Admin",
      };

      const count =
        await Notification.countDocuments({
          receiverId: req.user.id,
          receiverRole:
            roleMap[req.user.role],
          isRead: false,
        });

      return successResponse(
        res,
        "Unread count fetched",
        {
          count,
        }
      );
    } catch (error) {
      console.error(error);

      return errorResponse(
        res,
        "Server error",
        500
      );
    }
  };

/**
 * =========================
 * MARK ONE AS READ
 * =========================
 */
export const markAsRead =
  async (req, res) => {
    try {
      const roleMap = {
        user: "User",
        driver: "Driver",
        admin: "Admin",
      };

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            receiverId: req.user.id,
            receiverRole:
              roleMap[req.user.role],
          },
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return errorResponse(
          res,
          "Notification not found",
          404
        );
      }

      return successResponse(
        res,
        "Notification marked as read",
        notification
      );
    } catch (error) {
      console.error(error);

      return errorResponse(
        res,
        "Server error",
        500
      );
    }
  };

/**
 * =========================
 * MARK ALL AS READ
 * =========================
 */
export const markAllAsRead =
  async (req, res) => {
    try {
      const roleMap = {
        user: "User",
        driver: "Driver",
        admin: "Admin",
      };

      await Notification.updateMany(
        {
          receiverId: req.user.id,
          receiverRole:
            roleMap[req.user.role],
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      return successResponse(
        res,
        "All notifications marked as read"
      );
    } catch (error) {
      console.error(error);

      return errorResponse(
        res,
        "Server error",
        500
      );
    }
  };