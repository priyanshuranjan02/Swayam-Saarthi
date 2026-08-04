import Notification from "../models/Notification.js";
import { io } from "../app.js";

export const createNotification = async ({
  receiverId,
  receiverRole,
  title,
  message,
  type = "system",
  data = {},
}) => {
  try {
    const notification = await Notification.create({
      receiverId,
      receiverRole,
      title,
      message,
      type,
      data,
    });

    const room = `${receiverRole.toLowerCase()}:${receiverId}`;

    io.to(room).emit("notification:new", {
      notification,
    });

    console.log(
      `🔔 Notification sent to ${room}`
    );

    return notification;
  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    return null;
  }
};