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
    // Parse the incoming request JSON
    const json = await req.json();
    console.log("Received MPESA callback:", json); // Enhanced logging of the callback request

    // Get the callback body from the response
    const callback = json?.Body?.stkCallback;

    if (!callback) {
      console.error("Invalid MPESA callback structure: Missing stkCallback");
      return NextResponse.json({ error: 'Invalid MPESA callback structure' }, { status: 400 });
    }

    // Extract relevant fields from the callback
    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    // If payment result code is not successful, return an error response
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

    // Extract additional information from CallbackMetadata
    (CallbackMetadata?.Item || []).forEach((item: MpesaCallbackItem) => {
      if (item.Name === "PhoneNumber") phone = String(item.Value);
      if (item.Name === "TransactionDate") transactionDate = Number(item.Value);
      if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
    });

    // Retrieve the payment record using CheckoutRequestID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (paymentError || !payment) {
      console.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Prevent double updating if the payment is already marked as completed
    if (payment.payment_status === 'completed') {
      console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} is already completed.`);
      return NextResponse.json({ success: true, message: 'Payment already completed' });
    }

    // Parse the transaction date into a proper Date object
    const parsedDate = transactionDate
      ? new Date(
          `${transactionDate}`.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            '$1-$2-$3T$4:$5:$6'
          )
        )
      : new Date();

    // Update the payment status in Supabase to 'completed' and save other details
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_date: parsedDate,
        phone,
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
      })
      .eq('id', payment.id);

    // Handle any errors during the update process
    if (updateError) {
      console.error(`Failed to update payment for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    // Log the successful payment update
    console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} updated successfully`);

    return NextResponse.json({ success: true, message: 'Payment updated successfully' });
  } catch (err) {
    // Enhanced logging for error tracking
    console.error('MPESA callback processing error:', err);

    // Check if it's a network error or other type of error
    if (err instanceof Error) {
      console.error("Error message:", err.message);
    } else {
      console.error("Unknown error occurred during callback processing");
    }

    // Return a generic internal server error message
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
