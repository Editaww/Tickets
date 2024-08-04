import mongoose from "mongoose";

const BuyerSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  moneyBalance: { type: Number, required: true },
  bought_tickets: [{ type: String, required: true }],
});

export default mongoose.model("Buyer", BuyerSchema);
