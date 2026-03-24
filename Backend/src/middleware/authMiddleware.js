import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHelper.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Authorization token missing", 401);
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: normalize req.user structure
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role,
      email: decoded.email || null,
    };

    if (!req.user.id || !req.user.role) {
      return errorResponse(res, "Invalid token payload", 401);
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

export default authMiddleware;