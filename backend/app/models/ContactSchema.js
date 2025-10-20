import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ContactSchema = new Schema(
  {
    userId: {
      type: String,
      required: true, 
    },
    account: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email"],
    },
    phone: {
      type: String,
      match: [/^\+?[0-9\s\-()]+$/, "Invalid phone number"],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["supplier", "customer"],
      required: true,
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;
