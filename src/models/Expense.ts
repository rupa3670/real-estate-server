import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    category: {
      type: String,
      enum: ["materials", "salary_wages", "equipment", "others"],
      required: true,
    },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: [1, "Amount must be greater than 0"] },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);