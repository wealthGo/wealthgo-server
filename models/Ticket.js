import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["opened", "closed"],
      default: "opened",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
