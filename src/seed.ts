import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User";

dotenv.config();

const seed = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD missing in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URL as string);

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await User.create({ name: "Admin", email, password, role: "admin" });

  console.log("Admin created");
  process.exit(0);
};

seed();