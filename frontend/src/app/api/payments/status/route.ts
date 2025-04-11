// status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Extract the query parameter (e.g., checkout_request_id or claim_id)
    const { searchParams } = new URL(req.url);
    const checkoutRequestID = searchParams.get("checkout_request_id");
    const claimID = searchParams.get("claim_id");

    if (!checkoutRequestID && !claimID) {
      return NextResponse.json({ error: "Missing checkout_request_id or claim_id" }, { status: 400 });
    }

    // If a checkout_request_id is provided, check the payment status
    if (checkoutRequestID) {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('checkout_request_id', checkoutRequestID)
        .single();

      if (paymentError || !payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      return NextResponse.json({
        status: payment.payment_status,
        message: `Payment status for CheckoutRequestID: ${checkoutRequestID}`,
      });
    }

    // If a claim_id is provided, check the claim status
    if (claimID) {
      const { data: claim, error: claimError } = await supabase
        .from('found_ids_claims')
        .select('*')
        .eq('id', claimID)
        .single();

      if (claimError || !claim) {
        return NextResponse.json({ error: "Claim not found" }, { status: 404 });
      }

      return NextResponse.json({
        status: claim.status,
        message: `Claim status for ClaimID: ${claimID}`,
      });
    }

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
