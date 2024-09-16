import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqgzkghyzkfvpgoatpuh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZ3prZ2h5emtmdnBnb2F0cHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0MzY1ODcsImV4cCI6MjA0MjAxMjU4N30.u6PLo58o7-pnZI7OrqeuEr9qNaAhZ9Nvj3mkh9Z5iHg';

export const supabase = createClient(supabaseUrl, supabaseKey);
