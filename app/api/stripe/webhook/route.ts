import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "processing",
            stripe_payment_intent_id: session.payment_intent,
          })
          .eq("id", orderId);

        await supabaseAdmin.from("payments").insert({
          order_id: orderId,
          stripe_payment_id: session.payment_intent,
          amount: Number(session.amount_total || 0) / 100,
          currency: session.currency || "usd",
          status: "paid",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}