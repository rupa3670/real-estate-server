import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer" },
    meson: { type: mongoose.Schema.Types.ObjectId, ref: "Meson" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProjectAssignment = mongoose.model("ProjectAssignment", assignmentSchema);