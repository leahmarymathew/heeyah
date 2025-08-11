
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Register a new caretaker
// @route   POST /api/caretakers/register
// @access  Warden, Admin
export const registerCaretaker = async (req, res) => {
    const { email, password, fullName, phoneNo, shift_time, hostel_id } = req.body;

    // Validate shift_time
    if (!['Morning', 'Evening', 'Night'].includes(shift_time)) {
        return res.status(400).json({ error: 'Invalid shift time. Must be Morning, Evening, or Night.' });
    }

    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) return res.status(400).json({ error: authError.message });
    if (!authData.user) return res.status(400).json({ error: "Auth user creation failed." });

    // Step 2: Create the Caretaker record
    const caretaker_id = `CARE-${uuidv4().slice(0, 5).toUpperCase()}`;
    const { data, error } = await supabase
        .from('CARETAKER')
        .insert({
            caretaker_id,
            name: fullName,
            phone_no: phoneNo,
            shift_time,
            hostel_id, // Assuming the admin/warden provides the hostel_id
            user_id: authData.user.id // Link to the auth user
        })
        .select();

    if (error) {
        // Important: If this step fails, you should ideally delete the user created in auth
        // to prevent orphaned auth users. This is an advanced step.
        return res.status(400).json({ error: `Caretaker profile creation failed: ${error.message}` });
    }

    res.status(201).json({ message: 'Caretaker registered successfully', caretaker: data[0] });
};