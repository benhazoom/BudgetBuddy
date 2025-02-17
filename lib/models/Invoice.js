import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  name: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
