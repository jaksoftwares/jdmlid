import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using ANON key (safe for client-interaction level ops)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// MPESA credentials
const shortcode = process.env.MPESA_SHORTCODE!;
const passkey = process.env.MPESA_PASSKEY!;
const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
const callbackUrl = process.env.MPESA_CALLBACK_URL!;

async function getMpesaToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to get MPESA token:", await res.text());
    throw new Error("MPESA token request failed");
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, amount, lost_id, user_id } = body;

    if (!phone || !amount || !lost_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = await getMpesaToken();

    // Regex-free timestamp generation to avoid Tailwind parsing issues
    const iso = new Date().toISOString();
    const timestamp = iso.replaceAll("-", "").replaceAll(":", "").replaceAll("T", "").replaceAll("Z", "").slice(0, 14);
    
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: "LostIDClaim",
      TransactionDesc: "Payment for Lost ID Claim",
    };

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await stkRes.json();

    if (data.ResponseCode === "0") {
      const { CheckoutRequestID } = data;

      // Save the pending payment to Supabase
      const { error } = await supabase.from("payments").insert([
        {
          user_id,
          lost_id,
          amount,
          phone,
          payment_status: "pending",
          transaction_id: CheckoutRequestID,
          method: "mpesa",
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error.message);
        return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
      }

      return NextResponse.json({ success: true, CheckoutRequestID });
    } else {
      return NextResponse.json(
        { error: data.errorMessage || "STK Push initiation failed" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error in STK Push:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
