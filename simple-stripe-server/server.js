const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = new Stripe(
  "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Stripe server is running!" });
});

// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, shippingInfo, shipping, tax } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "php",
        product_data: {
          name: `${item.product.name} - ${item.boxSize || "Regular"} Box`,
        },
        unit_amount: Math.round((item.product.price || item.price) * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    if (tax > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Tax" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:8100/OrderConfirmation",
      cancel_url: "http://localhost:8100/cart",
      customer_email: shippingInfo?.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
