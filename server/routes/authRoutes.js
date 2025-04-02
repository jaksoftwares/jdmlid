const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Signup Route
// router.post('/signup', async (req, res) => {
//   console.log("🔹 Received Body:", req.body);

//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     console.log("🚨 Missing Fields:", { name, email, password });
//     return res.status(400).json({ error: 'Name, email, and password are required.' });
//   }

//   console.log("🔄 Sending to Supabase:", { email, password });

//   try {
//     const { data, error } = await supabase.auth.signUp(
//       { email, password, options: { data: { full_name: name } } },
//       { headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` } }
//     );

//     if (error) {
//       console.log("❌ Supabase Signup Error:", error);
//       return res.status(400).json({ error: error.message });
//     }

//     console.log("✅ Signup Success:", data);
//     res.status(201).json({ message: 'Signup successful', user: data.user });

//   } catch (err) {
//     console.error("🔥 Unexpected Error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Signup successful', user: data.user });
});

module.exports = router;

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword(
    { email, password },
    { headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` } }
  );

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const { user, session } = data;

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || 'User',
      phone: user.user_metadata?.phone || '',
    },
    session,
  });
});


// Logout Route
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(500).json({ error: 'Logout failed.' });
  }

  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
