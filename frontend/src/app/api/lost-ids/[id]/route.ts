import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET: Retrieve a specific Lost ID by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lost_ids")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching Lost ID:", error?.message);
    return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT: Update details of a specific Lost ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
  }

  let updateData;
  try {
    updateData = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Defensive cleanup: remove invalid or unintended fields
  delete updateData.id; // ID should not be updated
  delete updateData.id_categories; // Invalid field (doesn't exist in your DB)

  console.log("✅ Clean update data:", updateData);

  const { error: updateError } = await supabase
    .from("lost_ids")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    console.error("Error updating Lost ID:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data, error: fetchError } = await supabase
    .from("lost_ids")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    console.error("Error fetching updated Lost ID:", fetchError?.message);
    return NextResponse.json({ error: "Failed to fetch updated Lost ID" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE: Remove a specific Lost ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
  }

  const { error } = await supabase
    .from("lost_ids")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting Lost ID:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Lost ID deleted successfully" }, { status: 200 });
}
