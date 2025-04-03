import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// API Route Handler
export async function GET(req: NextRequest) {
  try {
    // Extract 'id' from the URL pathname
    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").pop(); // Get the last segment of the URL

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // Fetch lost ID record
    const { data, error } = await supabase
      .from("lost_ids")
      .select("*")
      .eq("id", id)
      .single();

    // Handle errors or missing data
    if (error || !data) {
      return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error retrieving lost ID:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
