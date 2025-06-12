import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pivetlovpflzcieyxosk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '<AQUÍ_TU_ANON_KEY>';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 