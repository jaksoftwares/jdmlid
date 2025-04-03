import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET all users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// GET a single user by ID
export async function GET_BY_ID(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 400 });
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
