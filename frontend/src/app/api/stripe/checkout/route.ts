import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY is missing on the server' }, { status: 500 });
  }

  const stripe = new Stripe(apiKey);
  
  try {
    const { userId, planType } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let priceData: any;
    if (planType === 'starter') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'HireReady Starter (BYOK)',
          description: 'Monthly subscription for Bring Your Own Key access',
        },
        unit_amount: 200, // $2.00
        recurring: { interval: 'month' },
      };
    } else if (planType === 'pro') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'HireReady Pro (Unlimited)',
          description: 'Monthly subscription for Unlimited managed generations',
        },
        unit_amount: 700, // $7.00
        recurring: { interval: 'month' },
      };
    } else {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hire-ready.app'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hire-ready.app'}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        planType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
