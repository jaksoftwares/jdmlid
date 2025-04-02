require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const lostIdsRoutes = require('./routes/lostIdsRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
// const claimRoutes = require("./routes/claimRoutes");



// // Use routes
app.use('/auth', authRoutes);
app.use('/lost-ids', lostIdsRoutes);
app.use('/users', userRoutes);
app.use("/categories", categoryRoutes);
// app.use("/claims", claimRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});