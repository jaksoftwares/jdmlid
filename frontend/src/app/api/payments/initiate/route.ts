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
const callbackUrl = process.env.MPESA_CALLBACK_URL!;

// Get MPESA Access Token
async function getMpesaToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", // This is for sandbox, update for production
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

    const data = JSON.parse(responseText); // Parsing the response text to get the data
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

    // Validate required parameters
    if (!phone || !amount || !lost_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required payment parameters" },
        { status: 400 }
      );
    }

    // Get MPESA token
    const token = await getMpesaToken();
    console.log("MPESA Token:", token);

    // Generate the Timestamp in the required format: YYYYMMDDHHMMSS
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14); // Correct timestamp format: YYYYMMDDHHMMSS

    // Generate password by encoding Shortcode + Passkey + Timestamp
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Prepare the STK Push request
    const stkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", // For PayBill Numbers
      Amount: amount,
      PartyA: phone, // MSISDN (12 digits Mobile Number)
      PartyB: shortcode, // The Shortcode receiving the payment
      PhoneNumber: phone, // MSISDN again for the user
      CallBackURL: callbackUrl, // Your callback URL
      AccountReference: lost_id, // Custom ID for transaction reference
      TransactionDesc: "Payment for Lost Item", // Description of the transaction
    };

    console.log("STK Push Request Payload:", stkPushRequest);

    // Send STK Push request to MPESA
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

    // Handle response errors
    if (!res.ok) {
      const errorMessage = data.errorMessage || "Failed to initiate STK push";
      console.error("Error in STK Push Request:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // Optional: Save Transaction Record in Supabase
    const { error: supabaseError } = await supabase.from("payments").insert([
      {
        user_id,
        lost_id,
        phone,
        amount,
        checkout_request_id: data.CheckoutRequestID,
        payment_status: "pending", // Default status before callback
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
