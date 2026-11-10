
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);

    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
