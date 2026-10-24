import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (isSupabaseConfigured) {
  console.log('✅ Supabase connected successfully using credentials.');
} else {
  console.log('ℹ️  Running in Local Demo Mode (Embedded in-memory store with pre-seeded demo records).');
  console.log('   To connect to live Supabase, configure SUPABASE_URL and SUPABASE_ANON_KEY in server/.env');
}
