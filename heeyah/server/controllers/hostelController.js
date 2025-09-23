
import supabase from '../config/supabaseClient.js';

// @desc    Create a new hostel
// @route   POST /api/hostels
// @access  Admin
export const createHostel = async (req, res) => {
    const { hostel_id, name, location, warden_id } = req.body;

    const { data, error } = await supabase
        .from('HOSTEL')
        .insert({ hostel_id, name, location, warden_id })
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Admin
export const getAllHostels = async (req, res) => {
    const { data, error } = await supabase
        .from('HOSTEL')
        .select(`
            *,
            WARDEN ( name, email )
        `);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

