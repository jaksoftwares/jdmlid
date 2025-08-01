import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET a specific category
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('id_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT (update a category)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name, recovery_fee } = await req.json();

  if (!name || recovery_fee === undefined || recovery_fee === null) {
    return NextResponse.json({ error: 'name and recovery_fee are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('id_categories')
    .update({ name, recovery_fee })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Category updated successfully',
    category: data
  }, { status: 200 });
}

// DELETE (delete a category)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { error } = await supabase
    .from('id_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
}
