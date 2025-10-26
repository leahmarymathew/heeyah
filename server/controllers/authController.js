// This file now contains helper functions for your authentication system.
// The main login logic is on the frontend.

import supabase from '../config/supabaseClient.js';

/**
 * @desc Finds the detailed profile of a user from the 'student', 'warden',
 * or 'caretaker' tables using their Supabase Auth User ID.
 * This is called by the middleware.
 * @param {string} userId - The UUID from Supabase auth.users.id
 * @returns {object | null} The user's full profile or null if not found.
 */
export const findUserProfile = async (userId) => {
    // 1. Check student table
    let { data: profile, error } = await supabase
        .from('student') // Use lowercase table name
        .select('*')
        .eq('user_id', userId)
        .single();

    if (profile) {
        return { ...profile, role: 'student' };
    }
    // Don't throw error if not found, just check next table
    if (error && error.code !== 'PGRST116') {
        console.error("Error checking student table:", error.message);
    }

    // 2. Check warden table
    ({ data: profile, error } = await supabase
        .from('warden') // Use lowercase table name
        .select('*')
        .eq('user_id', userId)
        .single());

    if (profile) {
        return { ...profile, role: 'warden' };
    }
    if (error && error.code !== 'PGRST116') {
        console.error("Error checking warden table:", error.message);
    }

    // 3. Check caretaker table
    ({ data: profile, error } = await supabase
        .from('caretaker') // Use lowercase table name
        .select('*')
        .eq('user_id', userId)
        .single());

    if (profile) {
        return { ...profile, role: 'caretaker' };
    }
    if (error && error.code !== 'PGRST116') {
        console.error("Error checking caretaker table:", error.message);
    }

    // 4. Check for 'admin' role (if they don't have a profile in other tables)
    // This is a simple check. You might have a separate 'admin' table or use Supabase metadata.
    // For now, if no profile is found, we return null.

    return null;
};

/**
 * @desc Ultra-simple login - just check if user exists in database tables by email
 * @route POST /api/auth/simple-login
 * @access Public
 */
export const simpleLogin = async (req, res) => {
    console.log('=== SIMPLE LOGIN FUNCTION CALLED ===');
    const { email, password } = req.body;
    console.log('Simple login attempt:', { email, password });

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required' 
        });
    }

    try {
        let userProfile = null;

        // Super simple approach - create test users if they don't exist
        // For demo purposes, let's create a test student if email matches pattern
        if (email === 'student@test.com') {
            // Check if test student exists
            const { data: existingStudent } = await supabase
                .from('student')
                .select('*')
                .eq('roll_no', 'TEST-STUDENT')
                .single();

            if (!existingStudent) {
                // Create test guardian first
                await supabase
                    .from('guardian')
                    .upsert({
                        guardian_id: 'TEST-GUARDIAN',
                        guardian_name: 'Test Guardian',
                        guardian_relation: 'Father',
                        guardian_phone: '9876543210'
                    });

                // Create test student
                const { data: newStudent, error: insertError } = await supabase
                    .from('student')
                    .insert({
                        roll_no: 'TEST-STUDENT',
                        user_id: 'test-user-id',
                        name: 'Test Student',
                        address: 'Test Address',
                        phone_no: '1234567890',
                        gender: 'male',
                        guardian_id: 'TEST-GUARDIAN',
                        hostel_id: 1
                    })
                    .select()
                    .single();

                if (!insertError && newStudent) {
                    userProfile = { ...newStudent, role: 'student', email: email };
                }
            } else {
                userProfile = { ...existingStudent, role: 'student', email: email };
            }
        }

        // Test warden
        if (email === 'warden@test.com') {
            const { data: existingWarden } = await supabase
                .from('warden')
                .select('*')
                .eq('warden_id', 'TEST-WARDEN')
                .single();

            if (!existingWarden) {
                const { data: newWarden, error: insertError } = await supabase
                    .from('warden')
                    .insert({
                        warden_id: 'TEST-WARDEN',
                        user_id: 'test-warden-id',
                        name: 'Test Warden',
                        phone_no: '1234567890',
                        hostel_id: 1
                    })
                    .select()
                    .single();

                if (!insertError && newWarden) {
                    userProfile = { ...newWarden, role: 'warden', email: email };
                }
            } else {
                userProfile = { ...existingWarden, role: 'warden', email: email };
            }
        }

        if (!userProfile) {
            console.log('No user profile found for email:', email);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found. Use student@test.com or warden@test.com for testing.' 
            });
        }

        console.log('Login successful for:', userProfile);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userProfile
        });

    } catch (error) {
        console.error('Simple login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed. Please try again.' 
        });
    }
};

