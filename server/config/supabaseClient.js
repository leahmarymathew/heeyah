// server/config/supabaseClient.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Read from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safety check
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Supabase URL or Service Role Key is missing from environment variables'
  );
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;