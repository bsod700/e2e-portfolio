const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const projectId = process.env.SUBABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID;
const serviceRoleKey = process.env.SUBABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;
const supabaseUrl = `https://${projectId}.supabase.co`;

if (!projectId || !serviceRoleKey) {
  console.error('❌ Error: SUBABASE_PROJECT_ID and SUBABASE_SERVICE_ROLE must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  console.log('🚀 Creating Supabase tables...\n');
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  try {
    // Method 1: Try using PostgREST to create tables (limited)
    // We'll use a workaround by trying to insert and catching the error
    
    // Create home_page_content table by attempting operations
    console.log('📝 Creating home_page_content table...');
    
    // Try to query the table - if it fails, we know it doesn't exist
    const { error: checkError } = await supabase
      .from('home_page_content')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.log('   ⚠️  Table does not exist. Creating via SQL...');
      console.log('\n   📋 Please run the following SQL in your Supabase SQL Editor:');
      console.log('   (Dashboard > SQL Editor > New Query)\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const fs = require('fs');
      const sqlPath = require('path').join(__dirname, 'setup-supabase-sql.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log(sql);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('   💡 Or run: npm run setup-supabase-sql\n');
    } else if (checkError) {
      console.log(`   ⚠️  Error checking table: ${checkError.message}`);
    } else {
      console.log('   ✅ home_page_content table already exists');
      
      // Try to insert default content if table is empty
      const { data: existing } = await supabase
        .from('home_page_content')
        .select('id')
        .limit(1)
        .single();

      if (!existing) {
        console.log('   📄 Inserting default content...');
        const { error: insertError } = await supabase
          .from('home_page_content')
          .insert({
            badge_text: 'From Vision to Infrastructure',
            hero_title: 'End-to-End\nDigital Solutions',
            hero_description: 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.'
          });

        if (insertError) {
          console.log(`   ⚠️  Could not insert default content: ${insertError.message}`);
        } else {
          console.log('   ✅ Default content inserted');
        }
      } else {
        console.log('   ✅ Content already exists');
      }
    }

    // Check admin_users table
    console.log('\n📝 Checking admin_users table...');
    const { error: adminCheckError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', 'guytagger@gmail.com')
      .single();

    if (adminCheckError && adminCheckError.code === '42P01') {
      console.log('   ⚠️  admin_users table does not exist.');
      console.log('   💡 It will be created when you run the SQL above.\n');
    } else if (adminCheckError && adminCheckError.code === 'PGRST116') {
      console.log('   👤 Adding admin user...');
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({ email: 'guytagger@gmail.com' });

      if (insertError) {
        console.log(`   ⚠️  Could not insert admin user: ${insertError.message}`);
        console.log('   💡 Make sure the admin_users table exists (run the SQL above)\n');
      } else {
        console.log('   ✅ Admin user added');
      }
    } else if (!adminCheckError) {
      console.log('   ✅ Admin user already exists');
    }

    console.log('\n✅ Setup check completed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor > New Query');
    console.log('   4. Copy and paste the SQL from scripts/setup-supabase-sql.sql');
    console.log('   5. Click "Run" to execute');
    console.log('\n   Or use the Supabase CLI if you have it installed.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();

