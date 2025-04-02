const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and ANON KEY are required.');
  process.exit(1); // Exit the application if configuration is missing
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
