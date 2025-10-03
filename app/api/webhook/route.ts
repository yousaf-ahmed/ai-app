export const dynamic = "force-dynamic";
import Transaction from "@/models/transiction";
import stripe from "@/utilis/stripe";
import db from "@/utilis/db";

export async function POST(req:Request){
 await db();

 const endpointSecret = process.env.Stripe_Webhook_Secret!;
 const sig = req.headers.get("stripe-signature")!;
 const body = await req.text();

 try {
    const event = stripe.webhooks.constructEvent(body,sig,endpointSecret);

    if(event.type === "checkout.session.completed"){
        const session = event.data.object as any;
        const transaction = await new Transaction({
        sessionId:session.id,
        customerId:session.customer,
        invoiceId:session.invoice,
        subscriptionId:session.subscription,
        mode:session.mode,
        paymentStatus: session.payment_status,
        customerEmail:session.customer_email,
        amountTotal:session.amount_total,
        status:session.status,
        });
        await transaction.save();

        return Response.json({message:'webhhok session completed'})
    }
 } catch (error) {
    console.error(error);
    return new Response("Webhookerror",{status:400})
 }
}