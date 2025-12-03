import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idsnnwkdcjnqifurnqkr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc25ud2tkY2pucWlmdXJucWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTk5MDUsImV4cCI6MjA4MDMzNTkwNX0.gtUDoT5eSlIFzBfyHA2JXIntL7b_KD4OVxarAD_jrVQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);