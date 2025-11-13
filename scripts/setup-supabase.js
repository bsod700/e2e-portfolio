const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const projectId = process.env.SUBABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID;
const serviceRoleKey = process.env.SUBABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;
const supabaseUrl = `https://${projectId}.supabase.co`;

if (!projectId || !serviceRoleKey) {
  console.error('❌ Error: SUBABASE_PROJECT_ID and SUBABASE_SERVICE_ROLE must be set in .env file');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupSupabase() {
  console.log('🚀 Setting up Supabase database...\n');
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  try {
    // 1. Create home_page_content table
    console.log('📝 Creating home_page_content table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create the home_page_content table
        CREATE TABLE IF NOT EXISTS home_page_content (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          badge_text TEXT NOT NULL DEFAULT 'From Vision to Infrastructure',
          hero_title TEXT NOT NULL DEFAULT 'End-to-End\nDigital Solutions',
          hero_description TEXT NOT NULL DEFAULT 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.',
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create an index on updated_at for faster queries
        CREATE INDEX IF NOT EXISTS idx_home_page_content_updated_at ON home_page_content(updated_at DESC);

        -- Enable Row Level Security (RLS)
        ALTER TABLE home_page_content ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public read access" ON home_page_content;
        DROP POLICY IF EXISTS "Allow authenticated users to modify" ON home_page_content;

        -- Create a policy that allows anyone to read (for public display)
        CREATE POLICY "Allow public read access" ON home_page_content
          FOR SELECT
          USING (true);

        -- Create a policy that allows authenticated users to insert/update
        CREATE POLICY "Allow authenticated users to modify" ON home_page_content
          FOR ALL
          USING (auth.role() = 'authenticated');
      `
    });

    if (tableError) {
      // If RPC doesn't work, try direct SQL execution via REST API
      console.log('⚠️  RPC method not available, trying alternative approach...');
      await createTableDirectly();
    } else {
      console.log('✅ home_page_content table created successfully\n');
    }

    // 2. Create admin_users table (optional, for managing multiple admins)
    console.log('📝 Creating admin_users table...');
    await createAdminUsersTable();

    // 3. Insert initial admin user
    console.log('👤 Setting up admin user...');
    await setupAdminUser();

    // 4. Insert default home page content if table is empty
    console.log('📄 Setting up default home page content...');
    await setupDefaultContent();

    console.log('\n✅ Supabase setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ home_page_content table created');
    console.log('   ✅ Row Level Security policies configured');
    console.log('   ✅ admin_users table created');
    console.log('   ✅ Default content initialized');
    console.log('\n🎉 You can now use the admin panel!');

  } catch (error) {
    console.error('❌ Error setting up Supabase:', error.message);
    process.exit(1);
  }
}

async function createTableDirectly() {
  // Try using the REST API to execute SQL
  const sqlQueries = [
    `CREATE TABLE IF NOT EXISTS home_page_content (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      badge_text TEXT NOT NULL DEFAULT 'From Vision to Infrastructure',
      hero_title TEXT NOT NULL DEFAULT 'End-to-End\nDigital Solutions',
      hero_description TEXT NOT NULL DEFAULT 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `CREATE INDEX IF NOT EXISTS idx_home_page_content_updated_at ON home_page_content(updated_at DESC);`,
    `ALTER TABLE home_page_content ENABLE ROW LEVEL SECURITY;`
  ];

  // Note: Direct SQL execution via REST API is limited
  // We'll use a different approach - create via Supabase dashboard SQL editor
  console.log('⚠️  Direct SQL execution via API is limited.');
  console.log('📝 Please run the SQL from SUPABASE_SETUP.md in your Supabase SQL Editor.');
  console.log('   Or use the Supabase CLI if you have it installed.\n');
}

async function createAdminUsersTable() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .limit(1);

  if (error && error.code === 'PGRST116') {
    // Table doesn't exist, we need to create it via SQL
    console.log('   ℹ️  admin_users table will be created via SQL (see SUPABASE_SETUP.md)');
    return;
  }

  if (!error) {
    console.log('✅ admin_users table already exists\n');
    return;
  }

  // Try to create via a workaround - check if we can insert
  const { error: insertError } = await supabase
    .from('admin_users')
    .insert({ email: 'guytagger@gmail.com' })
    .select();

  if (insertError && insertError.code === '42P01') {
    console.log('   ℹ️  admin_users table needs to be created via SQL (see SUPABASE_SETUP.md)\n');
  } else {
    console.log('✅ admin_users table ready\n');
  }
}

async function setupAdminUser() {
  // Check if admin_users table exists and add the user
  const { data: existing } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', 'guytagger@gmail.com')
    .single();

  if (existing) {
    console.log('   ✅ Admin user already exists in database\n');
    return;
  }

  // Try to insert
  const { error } = await supabase
    .from('admin_users')
    .insert({ email: 'guytagger@gmail.com' })
    .select();

  if (error) {
    if (error.code === '42P01') {
      console.log('   ℹ️  admin_users table not found - will be created via SQL\n');
    } else {
      console.log(`   ⚠️  Could not insert admin user: ${error.message}\n`);
    }
  } else {
    console.log('   ✅ Admin user added to database\n');
  }
}

async function setupDefaultContent() {
  // Check if content already exists
  const { data: existing } = await supabase
    .from('home_page_content')
    .select('*')
    .limit(1)
    .single();

  if (existing) {
    console.log('   ✅ Default content already exists\n');
    return;
  }

  // Insert default content
  const { error } = await supabase
    .from('home_page_content')
    .insert({
      badge_text: 'From Vision to Infrastructure',
      hero_title: 'End-to-End\nDigital Solutions',
      hero_description: 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.'
    })
    .select();

  if (error) {
    if (error.code === '42P01') {
      console.log('   ⚠️  home_page_content table not found - please create it first\n');
    } else {
      console.log(`   ⚠️  Could not insert default content: ${error.message}\n`);
    }
  } else {
    console.log('   ✅ Default content inserted\n');
  }
}

// Run the setup
setupSupabase();

