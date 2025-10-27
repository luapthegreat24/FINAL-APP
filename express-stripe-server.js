const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

const app = express();
const PORT = 4242;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Express Stripe Server Running!", port: PORT });
});

// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Creating Stripe checkout session...");
    const { cart, shippingInfo, shipping, tax } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
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

    // Add shipping if exists
    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax if exists
    if (tax && tax > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Tax (12%)" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url:
        "http://localhost:8100/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:8100/cart",
      metadata: {
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EXPRESS STRIPE SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
