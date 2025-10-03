// /utilis/stripe.ts
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("Missing Stripe secret key");
    }

    stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return stripe;
}
