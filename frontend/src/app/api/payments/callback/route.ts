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
    console.log("Received request for MPESA callback.");

    // Parse the incoming request body
    const json = await req.json();
    console.log("Received MPESA callback JSON:", JSON.stringify(json, null, 2));

    const callback = json?.Body?.stkCallback;
    if (!callback) {
      console.error("Invalid MPESA callback structure: Missing 'stkCallback'.");
      return NextResponse.json({ error: 'Invalid MPESA callback structure' }, { status: 400 });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    // Check if the payment was successful
    if (ResultCode !== 0) {
      console.error(`Payment failed for CheckoutRequestID: ${CheckoutRequestID}, ResultDesc: ${ResultDesc}`);
      return NextResponse.json(
        { error: 'Payment failed', description: ResultDesc },
        { status: 400 }
      );
    }

    // Log the successful callback details
    console.log(`Payment successful for CheckoutRequestID: ${CheckoutRequestID}`);
    let phone: string | null = null;
    let transactionDate: number | null = null;
    let mpesaReceiptNumber: string | null = null;

    // Extract the necessary details from the callback metadata
    (CallbackMetadata?.Item || []).forEach((item: MpesaCallbackItem) => {
      if (item.Name === "PhoneNumber") phone = String(item.Value);
      if (item.Name === "TransactionDate") transactionDate = Number(item.Value);
      if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
    });

    console.log("Extracted callback metadata:", {
      phone,
      transactionDate,
      mpesaReceiptNumber,
    });

    // Fetch the corresponding payment record from the database
    console.log(`Fetching payment with CheckoutRequestID: ${CheckoutRequestID}`);
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    // Log any errors in fetching the payment
    if (paymentError || !payment) {
      console.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    console.log(`Found payment for CheckoutRequestID: ${CheckoutRequestID}:`, payment);

    // If the payment status is already completed, log and exit
    if (payment.payment_status === 'completed') {
      console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} is already completed.`);
      return NextResponse.json({ success: true, message: 'Payment already completed' });
    }

    // Log the payment status before attempting to update
    console.log("Updating payment status to 'completed' for CheckoutRequestID:", CheckoutRequestID);

    // Parse the transaction date into a valid Date object
    const parsedDate = transactionDate
      ? new Date(
          `${transactionDate}`.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            '$1-$2-$3T$4:$5:$6'
          )
        )
      : new Date();

    console.log("Parsed transaction date:", parsedDate);

    // Attempt to update the payment record in the database
    console.log("Updating payment record in the database...");
    const { error: updateError, data: updateData } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_date: parsedDate,
        phone,
        transaction_id: mpesaReceiptNumber || CheckoutRequestID,
      })
      .eq('checkout_request_id', CheckoutRequestID);

    // Log any errors or success during the update process
    if (updateError) {
      console.error(`Failed to update payment for CheckoutRequestID: ${CheckoutRequestID}, Error: ${updateError.message}`);
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    console.log(`Payment for CheckoutRequestID: ${CheckoutRequestID} updated successfully. Updated Data:`, updateData);

    // Return a success response if everything goes smoothly
    return NextResponse.json({ success: true, message: 'Payment updated successfully' });
  } catch (err) {
    // Log the error details if an exception is thrown
    console.error('MPESA callback processing error:', err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack trace:", err.stack);
    } else {
      console.error("Unknown error occurred during callback processing");
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ Add this GET handler for Safaricom's URL verification check
export async function GET() {
  console.log("GET request received for callback URL verification.");
  return NextResponse.json({ message: 'Callback URL is active' });
}
