import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('admin').select('*');
  if (error) {
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { id_number, lost_location, lost_date } = await request.json();
  const { data, error } = await supabase.from('admin').insert([
    { id_number, lost_location, lost_date }
  ]);
  if (error) {
    return NextResponse.json({ message: 'Error inserting data', error }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
