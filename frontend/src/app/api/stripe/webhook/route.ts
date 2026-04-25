import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY is missing on the server' }, { status: 500 });
  }

  const stripe = new Stripe(apiKey);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook payload error:', err.message);
    return NextResponse.json({ error: `Webhook payload error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout sessions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;

    if (userId && planType) {
      try {
        await supabase.from('profiles').update({ subscription_tier: planType }).eq('id', userId);
        console.log(`Successfully updated subscription_tier to ${planType} for user ${userId}`);
      } catch (err: any) {
        console.error('Database update failed in checkout webhook:', err);
      }
    }
  }

  // Handle paid invoices (Blueprint Step: wait-for-invoice-paid)
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const userId = invoice.metadata?.userId;
    
    // Fallback: search profile by stripe_customer_id if metadata is missing
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_customer_id', invoice.customer).single();
      targetUserId = profile?.id;
    }

    if (targetUserId) {
      try {
        // Find if this invoice contains "Example Services" to grant the benefit
        const hasExampleService = invoice.lines.data.some(line => line.description?.includes('Example Services'));
        
        if (hasExampleService) {
           const { data: profile } = await supabase.from('profiles').select('tokens').eq('id', targetUserId).single();
           const newTokens = (profile?.tokens || 0) + 100; // Grant 100 tokens as the benefit for $100 invoice
           await supabase.from('profiles').update({ tokens: newTokens }).eq('id', targetUserId);
           console.log(`Premium Invoice Paid: Added 100 tokens to user ${targetUserId}`);
        }
      } catch (err: any) {
        console.error('Database update failed in invoice webhook:', err);
      }
    }
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (userId) {
      try {
        await supabase.from('profiles').update({ subscription_tier: null }).eq('id', userId);
        console.log(`Successfully removed subscription_tier for user ${userId}`);
      } catch (err: any) {
        console.error('Database update failed in subscription deleted webhook:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
