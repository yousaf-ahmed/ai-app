"use server";
import { currentUser, EmailAddress } from "@clerk/nextjs/server";
import db from "@/utilis/db";
import transiction from "@/models/transiction";
import stripe from "@/utilis/stripe";
import { console } from "inspector";
import Transaction from "@/models/transiction";
interface CheckoutSessionResponse {
    url?: string;
    error?: string;
}

export async function createCheckoutSession():Promise<CheckoutSessionResponse>{
 const user = await currentUser();
 const coustmerEmail = user?.emailAddresses[0]?.emailAddress;
 
 if (!coustmerEmail) {
 return {
 error: "User email not found"
 };
 } 

 try {
    await db();
    const existingTransiction = await transiction.findOne({coustmerEmail});
    if (existingTransiction) {

        const Subscriptions = await stripe.subscriptions.list({
            customer: existingTransiction.coustmerId,
            status:'all',
            limit:1,
        });

        const currentSubscription = Subscriptions.data.find((sub) => sub.status ==="active");

        if (currentSubscription){
            return{error:"subscription already active"}
        }
    }
  
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: process.env.stripe_Monthly_price_id,
                quantity: 1,
            },
        ],
        mode: "subscription",
        customer_email: coustmerEmail, // Fixed typo here
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
    });

    return { url: session.url ?? undefined };
} catch (error) {
    return { error: 'Error creating Stripe checkout session' };
}
}

export async function createCustomerPortalSession(){
    const user = await currentUser();
    const customerEmail = user?.emailAddresses[0]?.emailAddress;

    try {
        const transaction = await Transaction.findOne({
            customerEmail,
        });

        const portalSession = await stripe.billingPortal.sessions.create({
            customer:transaction.customerId,
            return_url:`${process.env.NEXT_PUBLIC_URL}/dashboard`
        });
        return  portalSession.url ?? `${process.env.NEXT_PUBLIC_URL}/dashboard`;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}