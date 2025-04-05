import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Extract necessary fields from MPESA callback
  const {
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
    TransactionDate,
    PhoneNumber,
  } = body;

  if (ResultCode !== 0) {
    // Payment failed
    return NextResponse.json(
      { error: 'Payment failed', details: ResultDesc },
      { status: 400 }
    );
  }

  // Find the payment in the database
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', CheckoutRequestID)
    .single();

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  // Update payment status to 'completed'
  const { error } = await supabase
    .from('payments')
    .update({
      payment_status: 'completed',
      transaction_date: new Date(TransactionDate),
      phone: PhoneNumber,
    })
    .eq('id', payment.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Payment successful' });
}
