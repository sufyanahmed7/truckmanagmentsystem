import mongoose from "mongoose";

const JobItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const JobSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact", 
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact", 
      required: true,
    },
    date: { type: Date, required: true },
    items: [JobItemSchema],
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

//  unique reference per user
JobSchema.index({ reference: 1, userId: 1 }, { unique: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
