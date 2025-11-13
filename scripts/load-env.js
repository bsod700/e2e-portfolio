const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Support both SUBABASE and SUPABASE naming (typo vs correct)
const projectId = process.env.SUBABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUBABASE_ANON || process.env.SUPABASE_ANON || process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.SUBABASE_URL || process.env.SUPABASE_URL;
const serviceRole = process.env.SUBABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;

// Validate required variables
if (!anonKey) {
  console.error('❌ Error: SUPABASE_ANON or SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

// Use provided URL or construct from project ID
let finalSupabaseUrl = supabaseUrl;
if (!finalSupabaseUrl) {
  if (!projectId) {
    console.error('❌ Error: Either SUPABASE_URL or SUPABASE_PROJECT_ID must be set in .env file');
    process.exit(1);
  }
  finalSupabaseUrl = `https://${projectId}.supabase.co`;
}

// Environment files
const envDevPath = path.join(__dirname, '../src/environments/environment.ts');
const envProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Escape single quotes in values to prevent injection
const escapeValue = (value) => {
  if (!value) return '';
  return String(value).replace(/'/g, "\\'");
};

const envDevContent = `export const environment = {
  production: false,
  supabaseUrl: '${escapeValue(finalSupabaseUrl)}',
  supabaseAnonKey: '${escapeValue(anonKey)}'
};
`;

const envProdContent = `export const environment = {
  production: true,
  supabaseUrl: '${escapeValue(finalSupabaseUrl)}',
  supabaseAnonKey: '${escapeValue(anonKey)}'
};
`;

// Write environment files
fs.writeFileSync(envDevPath, envDevContent, 'utf8');
fs.writeFileSync(envProdPath, envProdContent, 'utf8');

console.log('✅ Environment files updated successfully');
console.log(`   Supabase URL: ${finalSupabaseUrl}`);
console.log(`   Anon Key: ${anonKey.substring(0, 20)}...`);
console.log(`   Files generated: environment.ts, environment.prod.ts`);

