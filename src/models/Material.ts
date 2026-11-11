import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ["concrete_masonry", "rod_wood", "finishing", "plumbing_electrical", "others"],
      required: true,
    },
    unit: { type: String, required: true, trim: true }, 
  },
  { timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);