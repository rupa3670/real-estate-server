import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    meson: { type: mongoose.Schema.Types.ObjectId, ref: "Meson", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    date: { type: Date, required: true },
    present: { type: Boolean, default: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ meson: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);