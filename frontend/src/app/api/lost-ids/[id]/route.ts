// Import required modules
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Utility function to validate UUID format
const isValidUUID = (uuid: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);

// Update the second argument type to reflect Next.js requirements
export async function GET(req: NextRequest, { params }: { params: { id: string | string[] } }) {
  const { id } = params;

  // Validate if id is a valid UUID
  if (Array.isArray(id)) {
    return NextResponse.json(
      { error: "Invalid ID format" },
      { status: 400 }
    );
  }

  // Check if ID is valid UUID
  if (!isValidUUID(id)) {
    return NextResponse.json(
      { error: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("lost_ids")
      .select("*")
      .eq("id", id)
      .single();

    // Check for error or empty data
    if (error || !data) {
      console.error("Error fetching lost ID:", error);
      return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
    }

    // Return fetched data
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error retrieving lost ID:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
