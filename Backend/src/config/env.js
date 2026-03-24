import dotenv from "dotenv";

const envConfig = () => {
  dotenv.config();

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not found");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET not found");
  }
};

export default envConfig;