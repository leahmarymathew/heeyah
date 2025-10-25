// This file might only contain helper functions now, as login is handled on the frontend.
// Make sure you have this helper function or similar.

import supabase from '../config/supabaseClient.js';

// Helper function to find a user's detailed profile based on Supabase user ID
export const findUserProfile = async (userId) => {
    // Check student table
    let { data: profile, error } = await supabase.from('student').select('*').eq('user_id', userId).single();
    if (profile) return { ...profile, role: 'student' };
    if (error && error.code !== 'PGRST116') console.error("Error checking student:", error);

    // Check warden table
    ({ data: profile, error } = await supabase.from('warden').select('*').eq('user_id', userId).single());
    if (profile) return { ...profile, role: 'warden' };
    if (error && error.code !== 'PGRST116') console.error("Error checking warden:", error);
    
    // Check caretaker table
    ({ data: profile, error } = await supabase.from('caretaker').select('*').eq('user_id', userId).single());
    if (profile) return { ...profile, role: 'caretaker' };
    if (error && error.code !== 'PGRST116') console.error("Error checking caretaker:", error);

    // Add admin check if needed (admins might just exist in Supabase auth with metadata)
    // Or return null if no profile found in custom tables
    return null; 
};

// Note: The loginUser function might be removed from here if login is fully frontend based.
