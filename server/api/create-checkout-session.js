const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse body if it's a string
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { cart, shippingInfo, shipping, tax } = body;

    console.log(
      "📦 Received:",
      JSON.stringify({
        hasCart: !!cart,
        cartLength: cart?.length,
        hasShipping: !!shippingInfo,
      })
    );

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    const line_items = cart.map((item) => {
      const price = item.product?.price || item.price || 0;
      const name = item.product?.name || "Cookie";

      return {
        price_data: {
          currency: "php",
          product_data: {
            name: `${name} - ${
              item.boxSize
                ? item.boxSize.charAt(0).toUpperCase() +
                  item.boxSize.slice(1) +
                  " Box"
                : "Regular Box"
            }`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping
    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Shipping Fee" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax
    if (tax && tax > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: { name: "Tax" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    console.log("💳 Creating session...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:8100/OrderConfirmation",
      cancel_url: "http://localhost:8100/cart",
      customer_email: shippingInfo?.email,
    });

    console.log("✅ Success:", session.id);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
};
