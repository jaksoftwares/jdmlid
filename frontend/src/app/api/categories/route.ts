import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET all categories
export async function GET() {
  const { data, error } = await supabase
    .from('id_categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching categories:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// POST create new category
export async function POST(req: NextRequest) {
  const { name, recovery_fee } = await req.json();

  if (!name || recovery_fee === undefined || recovery_fee === null) {
    return NextResponse.json({ error: 'name and recovery_fee are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('id_categories')
    .insert([{ name, recovery_fee }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Category created successfully',
    category: data
  }, { status: 201 });
}
