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
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required' 
        });
    }

    try {
        let userProfile = null;

        // Check student table first (by email pattern or direct lookup)
        const { data: students, error: studentError } = await supabase
            .from('student')
            .select('*');

        if (!studentError && students) {
            // Find student by checking auth users
            const { data: authUsers } = await supabase.auth.admin.listUsers();
            const authUser = authUsers?.users?.find(u => u.email === email);
            
            if (authUser) {
                const student = students.find(s => s.user_id === authUser.id);
                if (student) {
                    userProfile = { ...student, role: 'student', email: authUser.email };
                }
            }
        }

        // If not found in students, check warden table
        if (!userProfile) {
            const { data: wardens, error: wardenError } = await supabase
                .from('warden')
                .select('*');

            if (!wardenError && wardens) {
                const { data: authUsers } = await supabase.auth.admin.listUsers();
                const authUser = authUsers?.users?.find(u => u.email === email);
                
                if (authUser) {
                    const warden = wardens.find(w => w.user_id === authUser.id);
                    if (warden) {
                        userProfile = { ...warden, role: 'warden', email: authUser.email };
                    }
                }
            }
        }

        if (!userProfile) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found. Please check your email.' 
            });
        }

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

