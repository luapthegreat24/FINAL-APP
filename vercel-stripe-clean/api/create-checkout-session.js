const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

module.exports = async (req, res) => {
  // Set CORS headers for ALL requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🚀 Creating Stripe session...");

    const { cart, shippingInfo, shipping, tax, successUrl, cancelUrl } =
      req.body;

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
      line_items: line_items,
      mode: "payment",
      success_url: successUrl
        ? `${successUrl}?session_id={CHECKOUT_SESSION_ID}`
        : "http://localhost:8101/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "http://localhost:8101/cart",
      metadata: {
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    console.log("✅ Session created:", session.id);
    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
};
