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

    // 1. Add stronger validation for callback structure
    if (!json?.Body?.stkCallback) {
      console.error("Invalid callback structure:", json);
      return NextResponse.json({ error: 'Invalid MPESA callback format' }, { status: 400 });
    }

    const callback = json.Body.stkCallback;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    // 2. Handle failed payments first
    if (ResultCode !== 0) {
      console.warn(`Payment failed [${CheckoutRequestID}]: ${ResultDesc}`);
      
      // Update database with failed status
      await supabase.from('payments').update({ 
        payment_status: 'failed',
        failure_reason: ResultDesc
      }).eq('checkout_request_id', CheckoutRequestID);
      
      return NextResponse.json({ status: 'failed' });
    }

    console.log(`Payment successful [${CheckoutRequestID}]`);

    // 3. Fix metadata extraction
    let phone, mpesaReceiptNumber, transactionDateStr;
    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        switch (item.Name) {
          case "PhoneNumber": 
            phone = item.Value;
            break;
          case "MpesaReceiptNumber":
            mpesaReceiptNumber = item.Value;
            break;
          case "TransactionDate":
            transactionDateStr = String(item.Value); // Keep as string!
            break;
        }
      }
    }

    // 4. Proper date parsing
    let transactionDate = null;
    if (transactionDateStr && transactionDateStr.length === 14) {
      transactionDate = new Date(
        `${transactionDateStr.slice(0, 4)}-${transactionDateStr.slice(4, 6)}-${transactionDateStr.slice(6, 8)}T${transactionDateStr.slice(8, 10)}:${transactionDateStr.slice(10, 12)}:${transactionDateStr.slice(12, 14)}`
      );
    }

    console.log("Parsed metadata:", {
      phone,
      mpesaReceiptNumber,
      transactionDate
    });

    // 5. Fetch payment record
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select()
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (!payment || fetchError) {
      console.error(`Payment not found: ${CheckoutRequestID}`, fetchError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // 6. Update database (fix date format)
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
        transaction_date: transactionDate?.toISOString() || new Date().toISOString(), // ISO format required
        // Don't overwrite original phone number!
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

// ✅ Add this GET handler for Safaricom's URL verification check
export async function GET() {
  console.log("GET request received for callback URL verification.");
  return NextResponse.json({ message: 'Callback URL is active' });
}
