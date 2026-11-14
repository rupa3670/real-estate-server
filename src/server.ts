import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routers/auth.routers";
import userRoutes from "./routers/user.routers";
import dashboardRoutes from "./routers/dashboard.routers";
import projectRoutes from "./routers/project.routers";
import fundRequestRoutes from "./routers/fundRequest.routers";
import expenseRoutes from "./routers/expense.routers";
import paymentRoutes from "./routers/payment.router";
import engineerRoutes from "./routers/engineer.router";
import masonRoutes from "./routers/meson.router";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.json({ message: "Real Estate Server is running!" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/fund-requests", fundRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/masons", masonRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  });
}

export default app;