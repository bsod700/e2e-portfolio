#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

async function quickSetup() {
  console.log('🚀 Quick Supabase Setup\n');
  console.log(`📡 Project: ${projectId}`);
  console.log(`🔗 URL: ${supabaseUrl}\n`);

  // Read SQL file
  const sqlPath = path.join(__dirname, 'setup-supabase-sql.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 SQL TO RUN IN SUPABASE SQL EDITOR:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(sql);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📝 QUICK SETUP STEPS:\n');
  console.log('   1. Open: https://supabase.com/dashboard/project/' + projectId);
  console.log('   2. Click "SQL Editor" in the left sidebar');
  console.log('   3. Click "New query" button');
  console.log('   4. Copy the SQL above and paste it into the editor');
  console.log('   5. Click "Run" (or press Cmd/Ctrl + Enter)');
  console.log('\n   ✅ That\'s it! Your tables will be created.\n');

  // Check if tables exist after a delay (user might run SQL)
  console.log('💡 After running the SQL, I can verify the setup...\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Have you run the SQL in Supabase? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await verifySetup();
    } else {
      console.log('\n⏳ Run the SQL first, then run this script again to verify!');
    }
    rl.close();
  });
}

async function verifySetup() {
  console.log('\n🔍 Verifying setup...\n');

  // Check home_page_content table
  const { data: contentData, error: contentError } = await supabase
    .from('home_page_content')
    .select('*')
    .limit(1);

  if (contentError) {
    if (contentError.code === '42P01') {
      console.log('❌ home_page_content table not found');
      console.log('   Please run the SQL in Supabase SQL Editor\n');
    } else {
      console.log(`⚠️  Error checking home_page_content: ${contentError.message}\n`);
    }
  } else {
    console.log('✅ home_page_content table exists');
    if (contentData && contentData.length > 0) {
      console.log('✅ Default content found');
    } else {
      console.log('⚠️  Table is empty - default content will be created on first use');
    }
  }

  // Check admin_users table
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', 'guytagger@gmail.com')
    .single();

  if (adminError) {
    if (adminError.code === '42P01') {
      console.log('❌ admin_users table not found');
      console.log('   Please run the SQL in Supabase SQL Editor\n');
    } else if (adminError.code === 'PGRST116') {
      console.log('⚠️  Admin user not found - will be created when you run the SQL\n');
    } else {
      console.log(`⚠️  Error checking admin_users: ${adminError.message}\n`);
    }
  } else {
    console.log('✅ admin_users table exists');
    console.log('✅ Admin user (guytagger@gmail.com) found');
  }

  // Final check
  if (!contentError && !adminError) {
    console.log('\n🎉 Setup verified successfully!');
    console.log('✅ Your admin panel is ready to use!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure you have a user with email "guytagger@gmail.com" in Supabase Auth');
    console.log('   2. Start your app: npm start');
    console.log('   3. Navigate to: http://localhost:4200/admin/login');
    console.log('   4. Sign in and start editing!\n');
  } else {
    console.log('\n⚠️  Setup incomplete. Please run the SQL in Supabase SQL Editor.\n');
  }
}

quickSetup();

