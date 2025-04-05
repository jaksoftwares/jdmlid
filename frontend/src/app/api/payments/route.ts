import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, lost_id, amount, payment_method, phone, transaction_id } = body;

    // Fetch Lost ID and Category data in one query to reduce database calls
    const { data: lostIdData, error: lostIdError } = await supabase
      .from('lost_ids')
      .select('category_id')
      .eq('id', lost_id)
      .single();

    if (lostIdError || !lostIdData) {
      return NextResponse.json({ error: 'Lost ID not found' }, { status: 400 });
    }

    const { category_id } = lostIdData;

    // Fetch category recovery fee
    const { data: categoryData, error: categoryError } = await supabase
      .from('id_categories')
      .select('recovery_fee')
      .eq('id', category_id)
      .single();

    if (categoryError || !categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }

    const requiredAmount = categoryData.recovery_fee;

    // Check if the amount paid matches the required fee
    if (amount !== requiredAmount) {
      return NextResponse.json(
        { error: `Incorrect amount. The required amount is KES ${requiredAmount}` },
        { status: 400 }
      );
    }

    // Insert payment and update payment status in one step
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert([
        {
          user_id,
          lost_id,
          amount,
          method: payment_method,
          phone,
          transaction_id,
          payment_status: 'pending',
        },
      ])
      .select()
      .single(); // To return a single inserted payment row

    if (insertError || !payment) {
      return NextResponse.json({ error: 'Failed to insert payment record' }, { status: 500 });
    }

    // Mark payment as success and update the lost ID status in a single transaction
    const { error: updateError } = await supabase
      .from('payments')
      .update({ payment_status: 'success' })
      .eq('id', payment.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }

    // Update the lost ID status to 'paid'
    const { error: updateLostIdError } = await supabase
      .from('lost_ids')
      .update({ status: 'paid' })
      .eq('id', lost_id);

    if (updateLostIdError) {
      return NextResponse.json({ error: 'Failed to update lost ID status' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Payment processed successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error processing payment:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
