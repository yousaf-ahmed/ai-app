// app/api/webhook/route.ts
export const dynamic = "force-dynamic";

import Transaction from "@/models/transiction";
import { getStripe } from "@/utilis/stripe"; // ✅ fixed import
import db from "@/utilis/db";

export async function POST(req: Request) {
  await db();

  const stripe = getStripe(); // ✅ get Stripe instance

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const transaction = new Transaction({
        sessionId: session.id,
        customerId: session.customer,
        invoiceId: session.invoice,
        subscriptionId: session.subscription,
        mode: session.mode,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        status: session.status,
      });

      await transaction.save();

      return Response.json({ message: "webhook session completed" });
    }

    // You may want to log unhandled event types
    console.log(`Unhandled event type: ${event.type}`);

    return Response.json({ message: "event received" });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response("Webhook error", { status: 400 });
  }
}
