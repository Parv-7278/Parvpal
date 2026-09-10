const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[Supabase] Client initialized successfully.');
} else {
  console.log('[Supabase] Running in local in-memory fallback mode (No valid credentials provided).');
}

module.exports = {
  supabase,
  isConfigured: () => !!supabase,
};
