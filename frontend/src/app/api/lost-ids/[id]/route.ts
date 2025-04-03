import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const isValidUUID = (uuid: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);

// Update the context parameter type to use Record<string, string>
export async function GET(req: NextRequest, context: { params: { [key: string]: string } }) {
  const { id } = context.params;

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