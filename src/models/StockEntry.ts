import mongoose from "mongoose";

const stockEntrySchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    type: { type: String, enum: ["bought", "used", "damaged"], required: true },
    quantity: { type: Number, required: true, min: [0.01, "Quantity must be greater than 0"] },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const StockEntry = mongoose.model("StockEntry", stockEntrySchema);