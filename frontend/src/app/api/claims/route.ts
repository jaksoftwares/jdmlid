import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/**
 * Submit a claim only if the payment is confirmed.
 */
export async function POST(req: NextRequest) {
  const {
    lost_id,
    user_id,
    category_id,
    name,
    email,
    phone,
    comments,
  } = await req.json();

  // Validate required fields
  if (!lost_id || !user_id || !category_id || !name || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // ✅ Step 1: Check if payment is made for this user & category
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('user_id', user_id)
      .eq('category_id', category_id)
      .eq('status', 'paid')
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found or not completed' }, { status: 400 });
    }

    // ✅ Step 2: Check if the claim already exists
    const { data: existingClaim, error: claimCheckError } = await supabase
      .from('found_ids_claims')
      .select('id')
      .eq('lost_id', lost_id)
      .eq('user_id', user_id)
      .single();

    if (claimCheckError) throw claimCheckError;
    if (existingClaim) {
      return NextResponse.json({ error: 'Claim for this ID already exists' }, { status: 400 });
    }

    // ✅ Step 3: Insert claim into database
    const { data: claim, error: claimError } = await supabase
      .from('found_ids_claims')
      .insert([
        {
          lost_id,
          user_id,
          category_id,
          name,
          email,
          phone,
          comments,
          payment_status: 'paid',
          status: 'pending', // Default status
        },
      ])
      .select()
      .single();

    if (claimError) throw claimError;

    return NextResponse.json({ message: 'Claim submitted successfully', claim }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error submitting claim:', error);
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
