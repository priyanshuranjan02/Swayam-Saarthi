import app from "./app.js";
import envConfig from "./config/env.js";
import connectDB from "./config/db.js";
import { server } from "./app.js";

envConfig();

const PORT = process.env.PORT || 5000;

// Connect DB first
connectDB();

// ✅ ONLY ONE LISTENER (Socket.io compatible)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});