import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lost_id, user_id, name, email, phone, comments, checkout_request_id } = body;

    console.log("Received Claim Submission Request:", body);

    // Validate required parameters
    if (!lost_id || !user_id || !name || !email || !phone || !comments || !checkout_request_id) {
      return NextResponse.json(
        { error: "Missing required claim parameters" },
        { status: 400 }
      );
    }

    // Fetch the payment record using CheckoutRequestID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkout_request_id)
      .single();

    if (paymentError || !payment) {
      console.error(`Payment not found for CheckoutRequestID: ${checkout_request_id}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // If the payment is not completed, reject the claim submission
    if (payment.payment_status !== 'completed') {
      console.error(`Payment for CheckoutRequestID: ${checkout_request_id} is not completed`);
      return NextResponse.json(
        { error: 'Payment is not completed. Cannot submit claim.' },
        { status: 400 }
      );
    }

    // Insert a new claim record into the found_ids_claims table
    const { error: claimError } = await supabase.from("found_ids_claims").insert([
      {
        lost_id,
        user_id,
        category_id: payment.category_id, // Assuming category_id is linked to the payment record
        name,
        email,
        phone,
        comments,
        payment_status: "completed", // Set the payment status for the claim
        status: "pending", // Initial status of the claim
      },
    ]);

    if (claimError) {
      console.error("Failed to insert claim record:", claimError.message);
      return NextResponse.json(
        { error: "Failed to submit claim" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Claim submitted successfully",
      status: "pending", // Claim is pending until reviewed
    });
  } catch (error) {
    console.error("Claim Submission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
