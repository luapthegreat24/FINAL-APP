import Stripe from "stripe";

// Use environment variable for Stripe secret key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

// Get frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8100";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, shippingInfo, shipping, tax, successUrl, cancelUrl } = req.body;

  console.log("📦 Received checkout request:");
  console.log("- Cart items:", cart?.length || 0);
  console.log("- Customer:", shippingInfo?.email);
  console.log("- Shipping:", shipping);
  console.log("- Tax:", tax);
  console.log("📍 Redirect URLs received:", { successUrl, cancelUrl });

  try {
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "php",
        product_data: {
          name: `${item.product.name} - ${
            item.boxSize
              ? item.boxSize.charAt(0).toUpperCase() +
                item.boxSize.slice(1) +
                " Box"
              : "Regular Box"
          }`,
          description: `${
            item.boxSize
              ? item.boxSize.charAt(0).toUpperCase() + item.boxSize.slice(1)
              : "Regular"
          } box`,
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as line item if present
    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: {
            name: "Shipping Fee",
            description: `Shipping to ${shippingInfo?.city || "your location"}`,
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as line item if present
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

    console.log("💳 Creating Stripe session with:", line_items.length, "items");

    // Use provided URLs or fallback to FRONTEND_URL (for development only)
    const finalSuccessUrl =
      successUrl && successUrl.trim() !== ""
        ? `${successUrl}?session_id={CHECKOUT_SESSION_ID}`
        : `${FRONTEND_URL}/OrderConfirmation?session_id={CHECKOUT_SESSION_ID}`;

    const finalCancelUrl =
      cancelUrl && cancelUrl.trim() !== "" ? cancelUrl : `${FRONTEND_URL}/cart`;

    console.log("✅ Using URLs:", { finalSuccessUrl, finalCancelUrl });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      customer_email: shippingInfo?.email || undefined,
      shipping_address_collection: {
        allowed_countries: ["PH"], // Philippines only
      },
      billing_address_collection: "required",
    });

    console.log("✅ Session created:", session.id);

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
