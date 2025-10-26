// Setup script to create test users in Supabase
// Run this with: node setup-test-users.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
    {
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        profile: {
            name: 'Test Student',
            roll_no: '2023BCS001'
        }
    },
    {
        email: 'warden@test.com', 
        password: 'password123',
        role: 'warden',
        profile: {
            name: 'Test Warden'
        }
    },
    {
        email: 'admin@test.com',
        password: 'password123', 
        role: 'warden', // Using warden table for admin for now
        profile: {
            name: 'Test Admin'
        }
    }
];

async function createTestUsers() {
    console.log('🚀 Creating test users...');
    
    for (const user of testUsers) {
        try {
            console.log(`\n📧 Creating user: ${user.email}`);
            
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true
            });
            
            if (authError) {
                console.error(`❌ Auth creation failed for ${user.email}:`, authError.message);
                continue;
            }
            
            console.log(`✅ Auth user created with ID: ${authData.user.id}`);
            
            // 2. Create profile in appropriate table
            const tableName = user.role === 'student' ? 'student' : 'warden';
            const profileData = {
                ...user.profile,
                user_id: authData.user.id,
                email: user.email
            };
            
            const { data: profileData2, error: profileError } = await supabase
                .from(tableName)
                .insert(profileData)
                .select()
                .single();
                
            if (profileError) {
                console.error(`❌ Profile creation failed for ${user.email}:`, profileError.message);
                continue;
            }
            
            console.log(`✅ Profile created in ${tableName} table`);
            
        } catch (error) {
            console.error(`❌ Unexpected error for ${user.email}:`, error.message);
        }
    }
    
    console.log('\n🎉 Test user setup complete!');
    console.log('\n📋 Test Credentials:');
    testUsers.forEach(user => {
        console.log(`${user.role.toUpperCase()}: ${user.email} / password123`);
    });
}

createTestUsers().catch(console.error);