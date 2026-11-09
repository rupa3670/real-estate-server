import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routers/auth.routers";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Import and use your routes here
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});