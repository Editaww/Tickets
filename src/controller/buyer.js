import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BuyerModel from "../model/buyer.js";
import buyer from "../model/buyer.js";

const SIGN_UP = async (req, res) => {
  try {
    if (!req.body.email || !req.body.email.includes("@")) {
      return res.status(400).json({ message: "Invalid email mail format" });
    }

    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters, including at least one number",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const buyer = {
      id: uuidv4(),
      name: name,
      email: req.body.email,
      moneyBalance: req.body.moneyBalance,
      password: hash,
    };
    const response = await new BuyerModel(buyer);

    await response.save();

    return res
      .status(201)
      .json({ message: " Buyer was created", response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in aplication" });
  }
};

const LOGIN = async (req, res) => {
  try {
    const buyer = await BuyerModel.findOne({ email: req.body.email });
    if (!buyer) {
      return res.status(401).json({ message: "You email or password is bad" });
    }

    const isPasswordMach = bcrypt.compareSync(
      req.body.password,
      buyer.password
    );
    if (!isPasswordMach) {
      return res.status(401).json({ message: "You email or password is bad" });
    }
    const token = jwt.sign(
      { email: buyer.email, buyerId: buyer.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { email: buyer.email, buyerId: buyer.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({ token: token, refreshToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const REFRESH_JWT_TOKEN = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, buyer) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Invalid or expired refresh token" });
      }

      const newToken = jwt.sign(
        { email: buyer.email, buyerId: buyer.buyerId },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      const newRefreshToken = jwt.sign(
        { email: buyer.email, buyerId: buyer.buyerId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "24h" }
      );

      return res
        .status(200)
        .json({ token: newToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_BUYERS = async (req, res) => {
  try {
    const response = await BuyerModel.find();
    const sortedBuyers = response.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({ response: sortedBuyers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_BUYER_BY_ID = async (req, res) => {
  try {
    const response = await BuyerModel.findOne({ id: req.params.id });

    return res.status(200).json({ buyer: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_BUYER_BY_ID_TICKETS = async (req, res) => {
  try {
    const buyerId = req.params.id;
    const buyerWithTickets = await BuyerModel.aggregate([
      { $match: { id: buyerId } },
      {
        $lookup: {
          from: "tickets",
          localField: "id",
          foreignField: "buyerId",
          as: "bought_tickets",
        },
      },
    ]);

    if (!buyerWithTickets || buyerWithTickets.length === 0) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    return res.status(200).json({ buyer: buyerWithTickets[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

export {
  SIGN_UP,
  LOGIN,
  REFRESH_JWT_TOKEN,
  GET_BUYERS,
  GET_BUYER_BY_ID,
  GET_BUYER_BY_ID_TICKETS,
};
