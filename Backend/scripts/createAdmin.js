import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Admin from "../src/models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const email = "priyanshuranjan9305@gmail.com";
    const password = "Priyanshu@9305";

    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.name = "Priyanshu Ranjan";
      admin.password = hashedPassword;

      await admin.save();

      console.log("✅ Existing admin updated.");
    } else {
      await Admin.create({
        name: "Priyanshu Ranjan",
        email,
        password: hashedPassword,
      });

      console.log("✅ Admin created.");
    }

    console.log("--------------------------------");
    console.log("Email    :", email);
    console.log("Password :", password);
    console.log("--------------------------------");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();