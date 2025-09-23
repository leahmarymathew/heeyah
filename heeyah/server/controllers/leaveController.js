
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student gets their own leave records
// @route   GET /api/leave/my
// @access  Student
export const getMyLeaveRecords = async (req, res) => {
    const studentProfile = req.profile;

    const { data, error } = await supabase
        .from('LEAVE_RECORD')
        .select('*')
        .eq('roll_no', studentProfile.roll_no)
        .order('leave_start_time', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// @desc    Warden/Admin gets all leave records
// @route   GET /api/leave
// @access  Warden, Admin
export const getAllLeaveRecords = async (req, res) => {
    const { data, error } = await supabase
        .from('LEAVE_RECORD')
        .select(`
            *,
            STUDENT ( name, roll_no )
        `)
        .order('leave_start_time', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
