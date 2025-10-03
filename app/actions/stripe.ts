"use server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/utilis/db";
import transiction from "@/models/transiction";
import Transaction from "@/models/transiction";
import { getStripe } from "@/utilis/stripe";  // ✅ use lazy load

interface CheckoutSessionResponse {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;

  if (!customerEmail) {
    return { error: "User email not found" };
  }

  try {
    await db();

    const existingTransiction = await transiction.findOne({ customerEmail });
    const stripe = getStripe(); // ✅ Stripe only initialized here

    if (existingTransiction) {
      const subscriptions = await stripe.subscriptions.list({
        customer: existingTransiction.coustmerId,
        status: "all",
        limit: 1,
      });

      const currentSubscription = subscriptions.data.find(
        (sub) => sub.status === "active"
      );

      if (currentSubscription) {
        return { error: "Subscription already active" };
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID, // ✅ use uppercase consistent var name
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
    });

    return { url: session.url ?? undefined };
  } catch (error) {
    console.error(error);
    return { error: "Error creating Stripe checkout session" };
  }
}

export async function createCustomerPortalSession() {
  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;

  try {
    const transaction = await Transaction.findOne({ customerEmail });
    const stripe = getStripe(); // ✅ lazy load here too

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: transaction.customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    return portalSession.url ?? `${process.env.NEXT_PUBLIC_URL}/dashboard`;
  } catch (error) {
    console.error(error);
    return null;
  }
}
