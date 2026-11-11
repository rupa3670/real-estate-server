import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    monthlySalary: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Engineer = mongoose.model("Engineer", engineerSchema);