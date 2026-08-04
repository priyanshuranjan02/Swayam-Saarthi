import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import driverRoutes from "./routes/driverRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Swayam Saarthi Backend is running 🚀",
    version: "1.0.0",
  });
});

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: true, // allow frontend on any port (dev-safe)
    credentials: true,
  })
);
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================
   ERROR HANDLER (LAST)
========================= */
app.use(errorMiddleware);

/* =========================
   SOCKET.IO SETUP
========================= */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

export const connectedDrivers = new Map();

io.on("connection", (socket) => {
  console.log("🔗 Socket connected:", socket.id);

  /**
   * ==========================================
   * Join Booking / User / Driver / Admin Room
   * ==========================================
   */
  socket.on("join-room", ({ id, role }) => {
    if (!id) return;

    // Existing room (booking tracking / compatibility)
    socket.join(id);

    // New role-specific room
    if (role) {
      const roleRoom = `${role}:${id}`;
      socket.join(roleRoom);

      console.log(`📡 Joined role room: ${roleRoom}`);
    }

    // Keep existing driver tracking
    if (role === "driver") {
      connectedDrivers.set(id, socket.id);
      console.log(`🚗 Driver connected: ${id}`);
    }

    console.log(`📡 Joined room: ${id}`);
  });

  /**
   * ==========================================
   * Driver Live Location
   * ==========================================
   */
  socket.on("driver:location", (data) => {
    if (!data.bookingId) return;

    io.to(data.bookingId).emit("driver:location", {
      bookingId: data.bookingId,
      latitude: data.latitude,
      longitude: data.longitude,
      updatedAt: Date.now(),
    });
  });

  /**
   * ==========================================
   * Disconnect
   * ==========================================
   */
  socket.on("disconnect", () => {
    for (const [driverId, socketId] of connectedDrivers.entries()) {
      if (socketId === socket.id) {
        connectedDrivers.delete(driverId);
        console.log(`🚗 Driver disconnected: ${driverId}`);
        break;
      }
    }

    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* ========================= */
export { server };
export default app;
