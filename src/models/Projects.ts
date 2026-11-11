import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    estimatedBudget: {
      type: Number,
      required: [true, "Estimated budget is required"],
      min: [1, "Estimated budget must be greater than 0"],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Manager is required"],
    },
    status: {
      type: String,
      enum: ["planned", "running", "on_hold", "completed"],
      default: "planned",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);