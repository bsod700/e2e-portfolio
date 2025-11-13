const https = require('https');
require('dotenv').config();

const projectId = process.env.SUBABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID;
const serviceRoleKey = process.env.SUBABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;
const supabaseUrl = `https://${projectId}.supabase.co`;

if (!projectId || !serviceRoleKey) {
  console.error('❌ Error: SUBABASE_PROJECT_ID and SUBABASE_SERVICE_ROLE must be set in .env file');
  process.exit(1);
}

// SQL to execute
const sql = `
-- Create home_page_content table
CREATE TABLE IF NOT EXISTS home_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT NOT NULL DEFAULT 'From Vision to Infrastructure',
  hero_title TEXT NOT NULL DEFAULT 'End-to-End\nDigital Solutions',
  hero_description TEXT NOT NULL DEFAULT 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_home_page_content_updated_at ON home_page_content(updated_at DESC);

ALTER TABLE home_page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON home_page_content;
DROP POLICY IF EXISTS "Allow authenticated users to modify" ON home_page_content;

CREATE POLICY "Allow public read access" ON home_page_content
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to modify" ON home_page_content
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO admin_users (email) VALUES ('guytagger@gmail.com')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read" ON admin_users;
CREATE POLICY "Allow authenticated users to read" ON admin_users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO home_page_content (badge_text, hero_title, hero_description)
VALUES (
  'From Vision to Infrastructure',
  'End-to-End\nDigital Solutions',
  'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.'
)
ON CONFLICT DO NOTHING;
`;

async function executeSQL() {
  console.log('🚀 Setting up Supabase via Management API...\n');
  console.log(`📡 Project: ${projectId}\n`);

  // Use Supabase Management API
  const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectId}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SQL executed successfully!\n');
          resolve(JSON.parse(data));
        } else {
          console.log(`⚠️  API returned status ${res.statusCode}`);
          console.log('   Response:', data);
          console.log('\n💡 Trying alternative method...\n');
          // Fallback to manual SQL instructions
          showManualInstructions();
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Using manual SQL method instead...\n');
      showManualInstructions();
      resolve(null);
    });

    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

function showManualInstructions() {
  const fs = require('fs');
  const path = require('path');
  const sqlPath = path.join(__dirname, 'setup-supabase-sql.sql');
  
  console.log('📋 Please run this SQL in your Supabase SQL Editor:\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log(sqlContent);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📝 Steps:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/' + projectId);
  console.log('   2. Click "SQL Editor" in the left sidebar');
  console.log('   3. Click "New query"');
  console.log('   4. Paste the SQL above');
  console.log('   5. Click "Run" (or press Cmd/Ctrl + Enter)');
  console.log('\n   Or view the SQL file: scripts/setup-supabase-sql.sql\n');
}

// Try to execute via API, fallback to manual instructions
executeSQL().then(() => {
  console.log('✅ Setup process completed!\n');
  console.log('🎉 After running the SQL, your admin panel will be ready to use!');
});

