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
 * @desc Ultra-simple login - authenticate with Supabase and get user profile
 * @route POST /api/auth/simple-login
 * @access Public
 */
export const simpleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    try {
        // First try to authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) {
            console.log('Supabase auth failed:', authError.message);
            
            // Fallback to hardcoded test users for development
            let userProfile = null;
            if (email === 'student@test.com') {
                userProfile = {
                    roll_no: 'TEST-STU',
                    name: 'Test Student',
                    email: 'student@test.com',
                    role: 'student',
                    phone_no: '1234567890',
                    address: 'Test Address',
                    gender: 'Male'
                };
            } else if (email === 'warden@test.com') {
                userProfile = {
                    warden_id: 'TEST-W',
                    name: 'Test Warden',
                    email: 'warden@test.com',
                    role: 'warden',
                    phone_no: '1234567890'
                };
            }

            if (!userProfile) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password. Use student@test.com or warden@test.com for testing.' 
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Login successful (fallback mode)',
                user: userProfile
            });
        }

        // If Supabase auth succeeded, get the user profile from database
        const userId = authData.user.id;
        const userProfile = await findUserProfile(userId);

        if (!userProfile) {
            return res.status(404).json({ 
                success: false, 
                message: 'User profile not found in database.' 
            });
        }

        // Add email to the profile
        userProfile.email = authData.user.email;

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

