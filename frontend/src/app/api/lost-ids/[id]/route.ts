import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Utility function to validate UUID format
const isValidUUID = (uuid: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // Ensure type is strictly { id: string }
) {
  const rawId = params.id;

  // Check if id is an array (Next.js sometimes sends an array for params)
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Validate that the id is a valid string and exists
  if (typeof id !== "string" || !id) {
    return NextResponse.json(
      { error: "Invalid ID format" },
      { status: 400 }
    );
  }

  // Validate UUID format
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

    if (error || !data) {
      console.error("Error fetching lost ID:", error);
      return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error retrieving lost ID:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
