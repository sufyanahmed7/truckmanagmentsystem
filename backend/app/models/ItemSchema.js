import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 20 },
    code: { type: String, required: true, maxlength: 20 },
    available: { type: String, enum: ["yes", "no"], required: true },
    weight: { type: Number, required: true, min: 0.1, max: 5000 },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", ItemSchema);
