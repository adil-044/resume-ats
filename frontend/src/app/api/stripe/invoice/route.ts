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
  
  // Use Service Role Key to access auth.users if needed
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch user email from auth.admin (Blueprint requirement: customer's email will be your email)
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !user) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch profile to check for stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    // 3. Identify/Create Customer (Blueprint Step: create-customer)
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
       const customer = await stripe.customers.create({
         email: user.email,
         description: 'Customer to Invoice',
         metadata: { userId }
       });
       customerId = customer.id;
       // Persist customer ID (Blueprint requirement)
       await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId);
    }

    // 4. Ensure Product/Price exists (Blueprint Step: create-product)
    const products = await stripe.products.list({ limit: 10 });
    let priceId;
    const exampleProduct = products.data.find(p => p.name === 'Example Services');
    
    if (exampleProduct && exampleProduct.default_price) {
      priceId = exampleProduct.default_price as string;
    } else {
      const product = await stripe.products.create({
        name: 'Example Services',
        default_price_data: {
          currency: 'usd',
          unit_amount: 10000 // $100.00
        }
      });
      priceId = product.default_price as string;
    }

    // 5. Create Draft Invoice (Blueprint Step: create-invoice)
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: { userId }
    });

    // 6. Add Invoice Item (Blueprint Step: add-invoice-item)
    // Blueprint says pricing: { price: ... } but the SDK uses price: ...
    // We follow the SDK unless it's a specific custom bridge
    await stripe.invoiceItems.create({
      customer: customerId,
      price: priceId,
      invoice: invoice.id
    });

    // 7. Finalize and Send Invoice (Blueprint Step: send-invoice)
    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    // Return the hosted invoice URL (Blueprint Step: view-invoice)
    return NextResponse.json({ url: sentInvoice.hosted_invoice_url });
  } catch (err: any) {
    console.error('Error creating Stripe invoice:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
