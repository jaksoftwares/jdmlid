import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      // Fetch a single user by ID
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } else {
      // Fetch all users
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Error retrieving users" }, { status: 500 });
      }

      return NextResponse.json(users, { status: 200 });
    }
  } catch (err) {
    console.error("Error retrieving users:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT (update) a user by ID
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const { full_name, email, phone } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ full_name, email, phone })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// DELETE a user by ID
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
