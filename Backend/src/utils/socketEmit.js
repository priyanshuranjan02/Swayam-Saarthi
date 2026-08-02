import { io } from "../app.js";

/* ===========================
   USER NOTIFICATIONS
=========================== */

export const notifyUser = (userId, event, payload) => {
  io.to(userId.toString()).emit(event, payload);
};

/* ===========================
   DRIVER NOTIFICATIONS
=========================== */

export const notifyDriver = (driverId, event, payload) => {
  io.to(driverId.toString()).emit(event, payload);
};

/* ===========================
   ADMIN NOTIFICATIONS
=========================== */

export const notifyAdmin = (adminId, event, payload) => {
  io.to(adminId.toString()).emit(event, payload);
};

/* ===========================
   BROADCAST
=========================== */

export const notifyAll = (event, payload) => {
  io.emit(event, payload);
};