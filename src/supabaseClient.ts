import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logs
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key configured:', !!supabaseAnonKey);
console.log('Supabase Anon Key length:', supabaseAnonKey?.length || 0);

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 