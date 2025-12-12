// Quick test to check what hostel IDs exist
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
    console.log('📊 Checking auth users vs profile users...');
    
    // Get auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
        console.error('❌ Auth error:', authError.message);
        return;
    }
    
    console.log('\n🔐 Auth Users:');
    authUsers.users.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`);
    });
    
    // Check students
    const { data: students, error: studentError } = await supabase
        .from('student')
        .select('roll_no, name, user_id')
        .limit(5);
        
    if (!studentError) {
        console.log('\n👨‍🎓 Student Profiles:');
        students.forEach(student => {
            const authUser = authUsers.users.find(u => u.id === student.user_id);
            console.log(`- ${student.name} (${student.roll_no}) -> Auth: ${authUser ? authUser.email : 'NOT FOUND'}`);
        });
    }
    
    // Check wardens  
    const { data: wardens, error: wardenError } = await supabase
        .from('warden')
        .select('warden_id, name, email, user_id')
        .limit(5);
        
    if (!wardenError) {
        console.log('\n👮‍♂️ Warden Profiles:');
        wardens.forEach(warden => {
            const authUser = authUsers.users.find(u => u.id === warden.user_id);
            console.log(`- ${warden.name} (${warden.email}) -> Auth: ${authUser ? authUser.email : 'NOT FOUND'}`);
        });
    }
}

checkData();