import express from "express";

import {
  POST_TICKET,
  GET_TICKETS,
  GET_TICKET_BY_ID,
  GET_BUYER_TICKETS,
} from "../controller/ticket.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/tickets", auth, POST_TICKET);
router.get("/tickets", auth, GET_TICKETS);
router.get("/tickets/:id", auth, GET_TICKET_BY_ID);
router.get("/tickets/buyer/:buyerId", auth, GET_BUYER_TICKETS);

export default router;
