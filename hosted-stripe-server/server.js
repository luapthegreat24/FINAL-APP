const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

const app = express();

// Enable CORS for all origins
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Stripe Payment Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { cart, shippingInfo, shipping, tax } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Build line items from cart
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "php",
        product_data: {
          name: `${item.product.name} - ${item.boxSize || "Regular"} Box`,
          description: `Delicious ${item.product.name} cookies`,
        },
        unit_amount: Math.round((item.product.price || item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping if present
    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: {
            name: "Shipping Fee",
            description: "Delivery to your location",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax if present
    if (tax && tax > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: {
            name: "Tax",
            description: "Sales tax",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    console.log("Creating Stripe session with items:", line_items.length);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url:
        "http://localhost:8100/OrderConfirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:8100/cart",
      customer_email: shippingInfo?.email,
      shipping_address_collection: {
        allowed_countries: ["PH"],
      },
      billing_address_collection: "required",
    });

    console.log("Session created successfully:", session.id);

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to create checkout session",
    });
  }
});

// Get checkout session details
app.get("/checkout-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🍪 Stripe Payment Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for all origins`);
  console.log(`🔑 Using Stripe test mode`);
});
