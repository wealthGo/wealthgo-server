import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const getTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const tickets = await Ticket.find({ customerId: id }).sort("-createdAt");

    if (tickets.length === 0) {
      res.status(200).json({ tickets: [] });
    } else if (tickets && tickets.length !== 0) {
      res.status(200).json({ tickets });
    } else {
      return null;
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    let newArr = [];
    let parsed = [];
    const tickets = await Ticket.find().sort("-createdAt");
    if (tickets.length === 0) {
      res.status(200).json({ tickets: [] });
    } else if (tickets && tickets.length !== 0) {
      res.status(200).json(tickets);
    } else {
      return null;
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const updateTickets = async (req, res) => {
  try {
    const { ticketId, action } = req.body;
    const update = { status: action };
    const filter = ticketId;
    const newInv = await Ticket.findByIdAndUpdate(filter, update);

    if (newInv) {
      const tickets = await Ticket.find().sort("-createdAt");
      res.status(200).json(tickets);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const tickets = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, email, message } = req.body;

    const ticket = new Ticket({
      customerId: id,
      emailId: email,
      subject: subject,
      message: message,
    });

    const savedTicket = await ticket.save();
    if (savedTicket) {
      const tickets = await Ticket.find({ customerId: id }).sort("-createdAt");
      res.status(200).json(tickets);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
