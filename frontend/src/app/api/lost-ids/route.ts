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

// Upload a new lost ID (Admin Only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id_number,
      owner_name,
      category_id,
      status,
      date_found,
      location_found,
      contact_info,
      comments,
    } = body;

    if (
      !id_number ||
      !owner_name ||
      !category_id ||
      !status ||
      !date_found ||
      !location_found ||
      !contact_info
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!isValidUUID(category_id)) {
      return NextResponse.json(
        { error: "Invalid category_id format" },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date_found).toISOString().split("T")[0];

    const { data: lostId, error: insertError } = await supabase
      .from("lost_ids")
      .insert([
        {
          id_number,
          owner_name,
          category_id,
          status,
          date_found: formattedDate,
          location_found,
          contact_info,
          comments,
        },
      ])
      .select();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Lost ID uploaded successfully", lostId: lostId[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error uploading lost ID:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all lost IDs (Public)
export async function GET() {
  try {
    const { data, error } = await supabase.from("lost_ids").select("*");

    if (error) {
      console.error("Error fetching lost IDs:", error);
      return NextResponse.json({ error: "Error retrieving lost IDs" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error retrieving lost IDs:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get a lost ID by ID Number or Owner Name
// export async function GET_by_id(req: NextRequest) {
//   try {
//     const url = new URL(req.url); // Get full URL
//     const id = url.pathname.split('/').pop(); // Extract ID from URL

//     if (!id) {
//       return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
//     }

//     // Log ID to ensure it's correctly extracted
//     console.log("Fetched ID from URL:", id);

//     // Log the query being sent to Supabase
//     console.log("Querying for ID:", id);

//     const { data, error } = await supabase
//       .from("lost_ids")
//       .select("*")
//       .eq("id", id) // Check if the id is matching in the database
//       .single(); // Ensure a single record is returned

//     // Log Supabase response to check data or errors
//     console.log("Supabase Query Result:", data);
//     console.log("Supabase Query Error:", error);

//     if (error || !data) {
//       console.error("Error fetching lost ID:", error);
//       return NextResponse.json({ error: "Lost ID not found" }, { status: 404 });
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (err) {
//     console.error("Error retrieving lost ID:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// Search & Filter Lost IDs
export async function GET_search(req: NextRequest) {
  try {
    const url = new URL(req.url); // Get full URL
    const query = url.searchParams.get('query');  // Get 'query' from URL query string
    const category = url.searchParams.get('category'); // Get 'category' from URL query string

    let request = supabase.from("lost_ids").select("*");

    if (query) {
      request = request.or(`id_number.ilike.%${query}%,owner_name.ilike.%${query}%`);
    }

    if (category) {
      request = request.eq("category_id", category);
    }

    const { data, error } = await request;

    if (error) {
      console.error("Error searching lost IDs:", error);
      return NextResponse.json({ error: "Error searching lost IDs" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error searching lost IDs:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete a Lost ID (Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url); // Get full URL
    const id = url.pathname.split('/').pop(); // Extract the ID from the URL path

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const { error } = await supabase.from("lost_ids").delete().eq("id", id);

    if (error) {
      console.error("Error deleting lost ID:", error);
      return NextResponse.json({ error: "Error deleting lost ID" }, { status: 500 });
    }

    return NextResponse.json({ message: "Lost ID deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting lost ID:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update Lost ID Details (Admin Only)
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url); // Get full URL
    const id = url.pathname.split('/').pop(); // Extract the ID from the URL path

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const updateData = await req.json();

    const { error } = await supabase.from("lost_ids").update(updateData).eq("id", id);

    if (error) {
      console.error("Error updating lost ID:", error);
      return NextResponse.json({ error: "Error updating lost ID" }, { status: 500 });
    }

    return NextResponse.json({ message: "Lost ID updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating lost ID:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
