import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import ticketsRouter from "./src/router/ticket.js";
import buyersRouter from "./src/router/buyer.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log(err);
  });

app.use(ticketsRouter);
app.use(buyersRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "This endpiont does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
