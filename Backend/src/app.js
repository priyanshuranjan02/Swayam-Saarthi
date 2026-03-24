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

const app = express();

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
app.use("/api/payment", paymentRoutes);

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

io.on("connection", (socket) => {
  console.log("🔗 Socket connected:", socket.id);

  socket.on("join-room", (id) => {
    socket.join(id); // userId / driverId / adminId
    console.log(`📡 Joined room: ${id}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* ========================= */
export { server };
export default app;