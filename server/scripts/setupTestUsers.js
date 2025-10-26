import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Script to create test users in Supabase Auth and corresponding database records
 */

async function setupTestUsers() {
    console.log('🚀 Setting up test users...');

    try {
        // 0. Create a test hostel if none exists
        console.log('🏠 Setting up test hostel...');
        const { data: existingHostels } = await supabase
            .from('hostel')
            .select('hostel_id')
            .limit(1);

        let hostelId = 1;
        if (!existingHostels || existingHostels.length === 0) {
            const { error: hostelError } = await supabase
                .from('hostel')
                .insert({
                    hostel_id: 1,
                    hostel_name: 'Test Hostel',
                    location: 'Test Location'
                });
            
            if (hostelError) {
                console.log('⚠️ Hostel creation error:', hostelError.message);
            } else {
                console.log('✅ Test hostel created');
            }
        } else {
            hostelId = existingHostels[0].hostel_id;
            console.log('✅ Using existing hostel ID:', hostelId);
        }

        // 1. Create test student user
        console.log('📧 Creating student@test.com...');
        
        const { data: studentAuthData, error: studentAuthError } = await supabase.auth.admin.createUser({
            email: 'student@test.com',
            password: 'test123',
            email_confirm: true
        });

        if (studentAuthError && !studentAuthError.message.includes('already been registered')) {
            throw studentAuthError;
        }

        // Get the student user ID
        const { data: allUsers } = await supabase.auth.admin.listUsers();
        const studentUser = allUsers.users.find(u => u.email === 'student@test.com');
        
        if (!studentUser) {
            throw new Error('Failed to find student auth user');
        }

        console.log('✅ Student auth user ready:', studentUser.id);

        // 2. Create guardian record
        console.log('👨‍👩‍👧‍👦 Creating guardian record...');
        
        const { error: guardianError } = await supabase
            .from('guardian')
            .upsert({
                guardian_id: 'TEST-G',
                guardian_name: 'Test Guardian',
                guardian_relation: 'Father',
                guardian_phone: '9876543210'
            });

        if (guardianError) {
            console.log('⚠️ Guardian record error:', guardianError.message);
        } else {
            console.log('✅ Guardian record ready');
        }

        // 3. Create student database record
        console.log('🎓 Creating student database record...');
        
        const { error: studentDbError } = await supabase
            .from('student')
            .upsert({
                roll_no: 'TEST-STU',
                user_id: studentUser.id,
                name: 'Test Student',
                address: 'Test Address, Test City',
                phone_no: '1234567890',
                gender: 'Male',
                guardian_id: 'TEST-G',
                hostel_id: hostelId
            });

        if (studentDbError) {
            console.log('⚠️ Student database record error:', studentDbError.message);
        } else {
            console.log('✅ Student database record ready');
        }

        // 4. Create test warden user
        console.log('📧 Creating warden@test.com...');
        
        const { data: wardenAuthData, error: wardenAuthError } = await supabase.auth.admin.createUser({
            email: 'warden@test.com',
            password: 'test123',
            email_confirm: true
        });

        if (wardenAuthError && !wardenAuthError.message.includes('already been registered')) {
            throw wardenAuthError;
        }

        // Get the warden user ID
        const wardenUser = allUsers.users.find(u => u.email === 'warden@test.com') || 
                          (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'warden@test.com');
        
        if (!wardenUser) {
            throw new Error('Failed to find warden auth user');
        }

        console.log('✅ Warden auth user ready:', wardenUser.id);

        // 5. Create warden database record
        console.log('🏠 Creating warden database record...');
        
        const { error: wardenDbError } = await supabase
            .from('warden')
            .upsert({
                warden_id: 'TEST-W',
                user_id: wardenUser.id,
                name: 'Test Warden',
                phone_no: '1234567890',
                email: 'warden@test.com'
            });

        if (wardenDbError) {
            console.log('⚠️ Warden database record error:', wardenDbError.message);
        } else {
            console.log('✅ Warden database record ready');
        }

        console.log('\n🎉 Test users setup completed!');
        console.log('📋 Login credentials:');
        console.log('   Student: student@test.com / test123');
        console.log('   Warden:  warden@test.com / test123');
        console.log('\n🔗 You can now login at: http://localhost:5173');

    } catch (error) {
        console.error('❌ Error setting up test users:', error.message);
        console.error('Full error:', error);
    }
}

// Run the setup
setupTestUsers();