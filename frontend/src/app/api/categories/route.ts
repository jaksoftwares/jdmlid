import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// 🟢 Create Category
export async function POST(req: NextRequest) {
  const { name, recovery_fee } = await req.json();
  
  if (!name || recovery_fee == null) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('id_categories')
      .insert([{ name, recovery_fee }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Category created successfully', category: data }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 🟢 Get All Categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('id_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 🟢 Update Category
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');  // Get ID from query parameters
  const { name, recovery_fee } = await req.json();

  if (!id || !name || recovery_fee == null) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('id_categories')
      .update({ name, recovery_fee })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Category updated successfully', category: data }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 🟢 Delete Category
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');  // Get ID from query parameters

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('id_categories').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
