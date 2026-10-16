import { getSocketInstance } from "./socketInstance.js";

/* ===========================
   USER NOTIFICATIONS
=========================== */
export const notifyUser = (userId, event, payload) => {
  getSocketInstance().to(userId.toString()).emit(event, payload);
};

/* ===========================
   DRIVER NOTIFICATIONS
=========================== */
export const notifyDriver = (driverId, event, payload) => {
  getSocketInstance().to(driverId.toString()).emit(event, payload);
};

/* ===========================
   ADMIN NOTIFICATIONS
=========================== */
export const notifyAdmin = (adminId, event, payload) => {
  getSocketInstance().to(adminId.toString()).emit(event, payload);
};

/* ===========================
   BROADCAST
=========================== */
export const notifyAll = (event, payload) => {
  getSocketInstance().emit(event, payload);
};
