import { errorResponse } from "../utils/responseHelper.js";

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, "Access denied", 403);
    }
    next();
  };
};

export default roleMiddleware;