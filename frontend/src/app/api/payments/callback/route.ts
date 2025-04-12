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
    console.log("Received MPESA callback:", json);

    const callback = json?.Body?.stkCallback;

    if (!callback) {
      console.error("Invalid MPESA callback structure: Missing stkCallback");
      return NextResponse.json({ error: 'Invalid MPESA callback structure' }, { status: 400 });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    if (ResultCode !== 0) {
      console.error(`Payment failed for CheckoutRequestID: ${CheckoutRequestID}, ResultDesc: ${ResultDesc}`);
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

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (paymentError || !payment) {
      console.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.payment_status === 'completed') {
      console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} is already completed.`);
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

      const { error: updateError, data: updateData } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_date: parsedDate,
        phone,
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
      })
      .eq('checkout_request_id', CheckoutRequestID); 

    if (updateError) {
      console.error(`Failed to update payment for CheckoutRequestID: ${CheckoutRequestID}, Error: ${updateError.message}`);
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} updated successfully. Updated Data:`, updateData);

    return NextResponse.json({ success: true, message: 'Payment updated successfully' });
  } catch (err) {
    console.error('MPESA callback processing error:', err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
    } else {
      console.error("Unknown error occurred during callback processing");
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ Add this GET handler for Safaricom's URL verification check
export async function GET() {
  return NextResponse.json({ message: 'Callback URL is active' });
}
