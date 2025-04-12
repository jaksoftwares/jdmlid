import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// MPESA Credentials from env
const shortcode = process.env.MPESA_SHORTCODE!;
const passkey = process.env.MPESA_PASSKEY!;
const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
// const callbackUrl = process.env.MPESA_CALLBACK_URL!;

// ✅ HARDCODED CALLBACK URL
const callbackUrl = "https://jkuatfindmylostid.vercel.app/api/payments/callback";

// Ensure environment variables are set
if (!shortcode || !passkey || !consumerKey || !consumerSecret || !callbackUrl) {
  console.error("Missing required MPESA credentials or callback URL in environment variables.");
  throw new Error("Missing required MPESA credentials or callback URL.");
}

// Get MPESA Access Token
async function getMpesaToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const responseText = await res.text();
    console.log("MPESA Token Response:", responseText);

    if (!res.ok) {
      console.error("Failed to get MPESA token:", responseText);
      throw new Error(`MPESA token request failed. Response: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching MPESA token:", error);
    throw new Error("Failed to fetch MPESA token");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, amount, lost_id, user_id } = body;

    console.log("Received Payment Request:", body);

    if (!phone) {
      return NextResponse.json({ error: "Missing phone parameter" }, { status: 400 });
    }
    if (!amount) {
      return NextResponse.json({ error: "Missing amount parameter" }, { status: 400 });
    }
    if (!lost_id) {
      return NextResponse.json({ error: "Missing lost_id parameter" }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 });
    }

    const token = await getMpesaToken();
    console.log("MPESA Token:", token);

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const stkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl, // ✅ HARDCODED CALLBACK URL USED HERE
      AccountReference: lost_id,
      TransactionDesc: "Payment for Lost Item",
    };

    console.log("STK Push Request Payload:", stkPushRequest);

    const res = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushRequest),
      }
    );

    const data = await res.json();
    console.log("MPESA STK Push Response:", data);

    if (!res.ok) {
      const errorMessage = data.errorMessage || "Failed to initiate STK push";
      console.error("Error in STK Push Request:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const { error: supabaseError } = await supabase.from("payments").insert([
      {
        user_id,
        lost_id,
        phone,
        amount,
        checkout_request_id: data.CheckoutRequestID,
        payment_status: "pending",
        method: "mpesa",
      },
    ]);

    if (supabaseError) {
      console.error("Failed to insert payment record:", supabaseError.message);
      return NextResponse.json(
        { error: "Failed to save payment record in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "STK Push initiated successfully",
      CheckoutRequestID: data.CheckoutRequestID,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Payment Initiation Error:", error.message);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
