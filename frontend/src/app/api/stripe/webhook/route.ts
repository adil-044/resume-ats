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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback for development testing
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: `Webhook payload error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const tokens = parseInt(session.metadata?.tokens || '0', 10);

    if (userId && tokens > 0) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();
          
        let newTokens = tokens;
        if (profile?.tokens) {
          newTokens += profile.tokens;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ tokens: newTokens })
          .eq('id', userId);

        if (updateError) {
          console.error('Failed to update tokens in database:', updateError);
        } else {
          console.log(`Successfully added ${tokens} tokens to user ${userId}`);
        }
      } catch (err: any) {
         console.error('Database operation failed in webhook:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
