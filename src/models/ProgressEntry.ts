import mongoose from "mongoose";

const progressEntrySchema = new mongoose.Schema(
  {
    workItem: { type: mongoose.Schema.Types.ObjectId, ref: "WorkItem", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    date: { type: Date, default: Date.now },
    doneQty: { type: Number, required: true, min: [0.01, "Quantity must be greater than 0"] },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const ProgressEntry = mongoose.model("ProgressEntry", progressEntrySchema);