import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY is missing on the server' }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase credentials missing on the server' }, { status: 500 });
  }

  const stripe = new Stripe(apiKey);
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    // 1. Retrieve the checkout session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const userId = session.metadata?.userId;
    const tokens = parseInt(session.metadata?.tokens || '0', 10);

    if (!userId || tokens <= 0) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 });
    }

    // 2. Fetch current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Verify Purchase: Failed to fetch profile:', fetchError);
      return NextResponse.json({ error: 'User profile not found: ' + fetchError.message }, { status: 404 });
    }

    // 3. Grant the tokens
    const currentTokens = profile?.tokens ?? 0;
    const newTokens = currentTokens + tokens;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: newTokens })
      .eq('id', userId);

    if (updateError) {
      console.error('Verify Purchase: Failed to update tokens:', updateError);
      return NextResponse.json({ error: 'Failed to update tokens: ' + updateError.message }, { status: 500 });
    }

    console.log(`Verify Purchase: Granted ${tokens} tokens to user ${userId}. New balance: ${newTokens}`);
    return NextResponse.json({ tokens: newTokens, granted: tokens });

  } catch (err: any) {
    console.error('Verify Purchase Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
