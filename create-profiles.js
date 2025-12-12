// Script to create user profiles for existing auth users
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfiles() {
    console.log('🚀 Creating user profiles...');
    
    try {
        // Get all auth users
        const { data: users, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
            console.error('❌ Failed to fetch users:', error.message);
            return;
        }
        
        console.log(`📋 Found ${users.users.length} auth users`);
        
        for (const user of users.users) {
            console.log(`\n👤 Processing user: ${user.email}`);
            
            if (user.email === 'student@test.com') {
                // Create student profile with all required fields
                const { data, error } = await supabase
                    .from('student')
                    .upsert({
                        user_id: user.id,
                        name: 'Test Student',
                        roll_no: '2023BCS001',
                        address: 'Test Address',
                        phone_no: '1234567890',
                        gender: 'Male',
                        hostel_id: 'THL0001'
                    })
                    .select();
                    
                if (error) {
                    console.error('❌ Student profile error:', error.message);
                } else {
                    console.log('✅ Student profile created');
                }
            } 
            else if (user.email === 'warden@test.com') {
                // Skip warden creation for now due to foreign key constraints
                console.log('⏭️ Skipping warden profile (foreign key constraints)');
            }
            else if (user.email === 'admin@test.com') {
                // Skip admin creation for now due to foreign key constraints  
                console.log('⏭️ Skipping admin profile (foreign key constraints)');
            }
        }
        
        console.log('\n🎉 Profile creation complete!');
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

createProfiles();