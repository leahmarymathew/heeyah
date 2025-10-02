// This file initializes the client-side Supabase client,
// which is used for direct interactions like file storage.

import { createClient } from '@supabase/supabase-js'
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

// IMPORTANT: Create a .env file in your client folder and add these variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Define them in .env.local and restart the dev server.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
