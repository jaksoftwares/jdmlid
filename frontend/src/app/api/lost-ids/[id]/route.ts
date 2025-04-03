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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!isValidUUID(id)) {
    return NextResponse.json(
      { error: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("lost_ids")
      .select("*")
      .eq("id", id) // Search by the UUID 'id'
      .single(); // Ensure it returns a single result

    if (error || !data) {
      console.error("Error fetching lost ID:", error);
      return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error retrieving lost ID:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
