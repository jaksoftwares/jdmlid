import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface MpesaCallbackItem {
  Name: string;
  Value: string | number;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const callback = json?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ error: 'Invalid MPESA callback structure' }, { status: 400 });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    if (ResultCode !== 0) {
      return NextResponse.json(
        { error: 'Payment failed', description: ResultDesc },
        { status: 400 }
      );
    }

    let phone: string | null = null;
    let transactionDate: number | null = null;
    let mpesaReceiptNumber: string | null = null;

    (CallbackMetadata?.Item || []).forEach((item: MpesaCallbackItem) => {
      if (item.Name === "PhoneNumber") phone = String(item.Value);
      if (item.Name === "TransactionDate") transactionDate = Number(item.Value);
      if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
    });

    // Retrieve the payment record using the CheckoutRequestID (transaction ID)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID) 
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check if the payment has already been completed to prevent double updating
    if (payment.payment_status === 'completed') {
      return NextResponse.json({ success: true, message: 'Payment already completed' });
    }

    const parsedDate = transactionDate
      ? new Date(
          `${transactionDate}`.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            '$1-$2-$3T$4:$5:$6'
          )
        )
      : new Date();

    // Update the payment status to 'completed' and save additional info (phone, transaction ID)
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_date: parsedDate,
        phone,
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
      })
      .eq('id', payment.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Payment updated successfully' });
  } catch (err) {
    console.error('MPESA callback error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
