const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * Submit a claim only if the payment is confirmed.
 */
exports.submitClaim = async (req, res) => {
    try {
        const { lost_id, user_id, category_id, name, email, phone, comments } = req.body;

        // Validate required fields
        if (!lost_id || !user_id || !category_id || !name || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ Step 1: Check if payment is made for this user & category
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("id, status")
            .eq("user_id", user_id)
            .eq("category_id", category_id)
            .eq("status", "paid")
            .single();

        if (paymentError || !payment) {
            return res.status(400).json({ error: "Payment not found or not completed" });
        }

        // ✅ Step 2: Insert claim into database
        const { data: claim, error: claimError } = await supabase
            .from("claims")
            .insert([
                {
                    lost_id,
                    user_id,
                    category_id,
                    name,
                    email,
                    phone,
                    comments,
                    payment_status: "paid",
                    status: "pending",
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (claimError) throw claimError;

        return res.status(201).json({ message: "Claim submitted successfully", claim });
    } catch (error) {
        console.error("Error submitting claim:", error);
        return res.status(500).json({ error: "Failed to submit claim" });
    }
};
