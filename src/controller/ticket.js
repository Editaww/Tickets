import { v4 as uuidv4 } from "uuid";
import TicketModel from "../model/ticket.js";
import BuyerModel from "../model/buyer.js";

const POST_TICKET = async (req, res) => {
  try {
    const ticket = {
      id: uuidv4(),
      title: req.body.title,
      ticketPrice: req.body.ticketPrice,
      fromLocation: req.body.fromLocation,
      toLocation: req.body.toLocation,
      toLocationPhotoUrl: req.body.toLocationPhotoUrl,
      buyerId: req.body.buyerId,
    };

    const response = await new TicketModel(ticket);

    await response.save();

    const buyerId = req.body.buyerId;
    const buyer = await BuyerModel.findOne({ id: buyerId });
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    if (buyer.moneyBalance < ticket.ticketPrice) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    buyer.moneyBalance -= ticket.ticketPrice;
    buyer.bought_tickets.push(response._id);

    await buyer.save();

    return res.status(201).json({ message: "Ticket was created", response });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the ticket" });
  }
};

const GET_TICKETS = async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    const sortedTickets = tickets.sort((a, b) => a.ticketPrice - b.ticketPrice);

    return res.status(200).json({ sortedTickets: sortedTickets });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_TICKET_BY_ID = async (req, res) => {
  try {
    const response = await TicketModel.findOne({ id: req.params.id });

    return res.status(200).json({ packages: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_BUYER_TICKETS = async (req, res) => {
  try {
    const response = await TicketModel.find({ buyerId: req.params.buyerId });

    return res.status(200).json({ ticket: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

export { POST_TICKET, GET_TICKETS, GET_TICKET_BY_ID, GET_BUYER_TICKETS };
