const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_KEY);

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

// Create Payment Intent
app.post("/payment/create", async (req, res) => {
  try {
    const total = Number(req.query.total);

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // Stripe amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log("Payment Intent Created:", paymentIntent.id);

    return res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
