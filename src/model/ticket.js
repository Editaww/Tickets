import mongoose from "mongoose";

const TicketShema = mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  toLocationPhotoUrl: { type: String, required: true },
  buyerId: { type: String, required: true },
});
export default mongoose.model("Ticket", TicketShema);
