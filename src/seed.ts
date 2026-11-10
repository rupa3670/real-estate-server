import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User } from "./models/User";

const seed = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const phone = process.env.ADMIN_PHONE?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !phone || !password) {
    console.log("ADMIN_EMAIL, ADMIN_PHONE and ADMIN_PASSWORD missing in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URL as string);

  const exists = await User.findOne({ $or: [{ email }, { phone }] });

  if (exists) {
   
    exists.name = name;
    exists.phone = phone;
    exists.password = password; 
    exists.role = "admin";
    exists.isActive = true;
    exists.mustChangePassword = false;
    await exists.save();
    console.log("Admin updated");
    process.exit(0);
  }

  await User.create({
    name,
    email,
    phone,
    password,
    role: "admin",
    mustChangePassword: false,
  });
  console.log("Admin created");
  process.exit(0);
};

seed();