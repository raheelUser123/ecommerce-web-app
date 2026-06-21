import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity || 1),
      0
    );

    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        total_amount: total,
        payment_status: "pending",
        order_status: "pending",
        customer_first_name: customer?.firstName || "",
        customer_last_name: customer?.lastName || "",
        customer_email: customer?.email || "",
        customer_address: customer?.address || "",
        customer_city: customer?.city || "",
        customer_state: customer?.state || "",
        customer_postal_code: customer?.postalCode || "",
      })
      .select("*")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Order creation failed" },
        { status: 500 }
      );
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      variation_id: item.variation_id || null,
      product_title: item.title,
      variation_detail: item.variant || "Default",
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      subtotal: Number(item.price || 0) * Number(item.quantity || 1),
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      return NextResponse.json(
        { error: orderItemsError.message },
        { status: 500 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer?.email || undefined,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: item.image?.startsWith("http") ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity || 1),
      })),
      metadata: {
        order_id: order.id,
        order_number: String(order.order_number || ""),
        customer_email: customer?.email || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Stripe checkout error" },
      { status: 500 }
    );
  }
}