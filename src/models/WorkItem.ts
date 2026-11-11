import mongoose from "mongoose";

const workItemSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true, trim: true }, 
    unit: { type: String, required: true, trim: true }, 
    targetQty: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const WorkItem = mongoose.model("WorkItem", workItemSchema);