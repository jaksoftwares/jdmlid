import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { claimId, categoryId, amount, method, phone } = body;

  if (!claimId || !amount || !method) {
    return NextResponse.json({ error: "Missing payment info" }, { status: 400 });
  }

  // Step 1: Insert into payments
  const { error: insertError } = await supabase
    .from("payments")
    .insert([
      {
        claim_id: claimId,
        category_id: categoryId,
        amount,
        method,
        phone,
        status: "success",
      },
    ]);

  if (insertError) {
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  // Step 2: Update claim's payment_status
  const { error: updateError } = await supabase
    .from("claims")
    .update({ payment_status: "paid" })
    .eq("id", claimId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 });
  }

  return NextResponse.json({ message: "Payment successful" });
}
