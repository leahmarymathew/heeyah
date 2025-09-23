
import supabase from '../config/supabaseClient.js';
import jwt from 'jsonwebtoken';

// Helper function to find a user's detailed profile based on their role
const findDetailedProfile = async (user) => {
    if (user.role === 'student') {
        const { data } = await supabase.from('STUDENT').select('*').eq('user_id', user.user_id).single();
        return { ...data, role: 'student' };
    }
    if (user.role === 'warden') {
        const { data } = await supabase.from('WARDEN').select('*').eq('user_id', user.user_id).single();
        return { ...data, role: 'warden' };
    }
    if (user.role === 'caretaker') {
        const { data } = await supabase.from('CARETAKER').select('*').eq('user_id', user.user_id).single();
        return { ...data, role: 'caretaker' };
    }
    // Add admin logic if needed
    return user;
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Find the user in your custom 'users' table
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (userError || !user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 2. Compare the provided password with the plain text password in the database
    const isMatch = (password === user.password);

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 3. If password is correct, generate a JWT
    const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET, // Make sure to add JWT_SECRET to your .env file!
        { expiresIn: '1d' }
    );

    // 4. Find the detailed profile of the user
    const detailedProfile = await findDetailedProfile(user);

    res.status(200).json({
        token,
        user: detailedProfile
    });
};