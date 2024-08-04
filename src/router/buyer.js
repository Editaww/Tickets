import express from "express";

import {
  SIGN_UP,
  LOGIN,
  REFRESH_JWT_TOKEN,
  GET_BUYERS,
  GET_BUYER_BY_ID,
  GET_BUYER_BY_ID_TICKETS,
} from "../controller/buyer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", SIGN_UP);
router.post("/login", LOGIN);
router.post("/refreshToken", REFRESH_JWT_TOKEN);
router.get("/buyers", auth, GET_BUYERS);
router.get("/buyers/:id", auth, GET_BUYER_BY_ID);
router.get("/buyers/:id/tickets", auth, GET_BUYER_BY_ID_TICKETS);

export default router;
