import Stripe from "stripe";

const secretkey = process.env.stripe_secret_key;

if(!secretkey){
    throw new Error("Missing Stripe secret key");
}

const stripe = new Stripe(secretkey, {
    apiVersion: "2024-12-18.acacia" as any,
});

export default stripe;
