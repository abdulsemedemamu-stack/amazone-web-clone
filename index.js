const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Firebase Functions Working",
  });
});

/* PAYMENT ROUTE */
app.post("/payment/create", async (req, res) => {
  try {
    const total = Number(req.query.total);

    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });

      console.log(paymentIntent);

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(400).json({
        message: "Total amount must be greater than 0",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
