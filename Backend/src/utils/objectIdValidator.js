import mongoose from "mongoose";

export const isValidObjectId = (id) =>
  typeof id === "string" && mongoose.isValidObjectId(id);
