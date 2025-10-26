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

