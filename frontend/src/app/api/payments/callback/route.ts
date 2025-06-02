import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);


export async function POST(req: NextRequest) {
  try {
    console.log("Received MPESA callback request");
    const json = await req.json();
    console.log("Raw callback JSON:", JSON.stringify(json, null, 2));

    // Validate callback structure
    if (!json?.Body?.stkCallback) {
      console.error("Invalid callback structure:", json);
      return NextResponse.json({ error: 'Invalid MPESA callback format' }, { status: 400 });
    }

    const callback = json.Body.stkCallback;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    // Handle failed payments
    if (ResultCode !== 0) {
      console.warn(`Payment failed [${CheckoutRequestID}]: ${ResultDesc}`);
      
      // Update payment status to failed
      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          payment_status: 'failed',
          failure_reason: ResultDesc
        })
        .eq('checkout_request_id', CheckoutRequestID);

      if (updateError) {
        console.error(`Failed to update failed payment: ${CheckoutRequestID}`, updateError);
      }
      
      return NextResponse.json({ status: 'failed' });
    }

    console.log(`Payment successful [${CheckoutRequestID}]`);

    // Extract metadata
    let phone, mpesaReceiptNumber, transactionDateStr;
    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        switch (item.Name) {
          case "PhoneNumber": 
            phone = String(item.Value);
            break;
          case "MpesaReceiptNumber":
            mpesaReceiptNumber = String(item.Value);
            break;
          case "TransactionDate":
            transactionDateStr = String(item.Value);
            break;
        }
      }
    }

    // Parse transaction date
    let transactionDate: Date | null = null;
    if (transactionDateStr && transactionDateStr.length === 14) {
      const year = transactionDateStr.slice(0, 4);
      const month = transactionDateStr.slice(4, 6);
      const day = transactionDateStr.slice(6, 8);
      const hour = transactionDateStr.slice(8, 10);
      const minute = transactionDateStr.slice(10, 12);
      const second = transactionDateStr.slice(12, 14);
      
      transactionDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }

    console.log("Parsed metadata:", {
      phone,
      mpesaReceiptNumber,
      transactionDate: transactionDate?.toISOString()
    });

    // Fetch payment record
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select()
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (!payment || fetchError) {
      console.error(`Payment not found: ${CheckoutRequestID}`, fetchError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Update database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
        transaction_date: transactionDate ? transactionDate.toISOString() : new Date().toISOString()
      })
      .eq('checkout_request_id', CheckoutRequestID);

    if (updateError) {
      console.error(`Update failed: ${CheckoutRequestID}`, updateError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`Payment ${CheckoutRequestID} updated successfully`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Callback processing error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Callback URL is active' });
}