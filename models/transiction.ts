import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema
const transactionSchema = new Schema({
  sessionId: String,
  customerId: String,
  invoiceId: String,
  subscriptionId: String, 
  mode: String,
  paymentStatus: String,
  customerEmail: String,
  amountTotal: Number,
  status: String,
});

// Use a consistent name for the model
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;
