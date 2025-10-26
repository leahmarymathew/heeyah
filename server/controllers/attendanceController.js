import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Mark student attendance (out-time or in-time)
 * @route   POST /api/attendance
 * @access  Caretaker, Warden, Admin
 */
export const markAttendance = async (req, res) => {
    const { roll_no, type } = req.body; 

    if (!roll_no || !type || !['in', 'out'].includes(type)) {
        return res.status(400).json({ error: 'Student roll_no and type (\'in\' or \'out\') are required.' });
    }

    const today = new Date().toISOString().slice(0, 10); 

    try {
        const { data: existingRecord, error: findError } = await supabase
            .from('attendance')
            .select('*')
            .eq('roll_no', roll_no)
            .eq('date', today)
            .single();

        if (findError && findError.code !== 'PGRST116') throw findError;

        if (existingRecord) {
            const updateField = type === 'in' ? 'in_time' : 'out_time';
            const { data, error } = await supabase
                .from('attendance')
                .update({ [updateField]: new Date().toISOString() })
                .eq('attendance_id', existingRecord.attendance_id)
                .select().single();

            if (error) throw error;
            res.status(200).json({ message: 'Attendance updated', record: data });
        } else {
            if (type === 'out') {
                return res.status(400).json({ error: 'Cannot mark Out time for a new record.' });
            }
            const attendance_id = `ATT-${uuidv4().slice(0, 6).toUpperCase()}`;
            const { data, error } = await supabase
                .from('attendance')
                .insert({ attendance_id, roll_no, date: today, in_time: new Date().toISOString() })
                .select().single();

            if (error) throw error;
            res.status(201).json({ message: 'Attendance marked', record: data });
        }
    } catch (error) {
        console.error('Error in markAttendance:', error.message);
        res.status(500).json({ error: 'Internal server error in markAttendance.' });
    }
};


/**
 * @desc    Get attendance records for a specific date
 * @route   GET /api/attendance
 * @access  Warden, Admin, Student (for self)
 */
export const getAttendance = async (req, res) => {
    const { date } = req.query;
    // --- THIS IS THE FIX ---
    // Read from req.profile (which is attached by protectAndFetchProfile)
    // instead of req.user.
    const userProfile = req.profile; 

    if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required.' });
    }
    
    // Safety check - ensures profile was attached correctly
    if (!userProfile || !userProfile.role) { 
        console.error('Error in getAttendance: req.profile is missing. Check middleware setup.');
        return res.status(401).json({ error: 'Authentication data missing.' });
    }

    try {
        if (userProfile.role === 'student') {
            // We can now directly use the roll_no from the profile
            const { data, error } = await supabase
                .from('attendance') 
                .select('in_time, out_time')
                .eq('roll_no', userProfile.roll_no) // Use roll_no from profile
                .eq('date', date)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
                throw error;
            }
            
            return res.status(200).json(data);

        } else {
            // Wardens/Admins can see all records
            const { data, error } = await supabase
                .from('attendance')
                .select(`*, student ( name, roll_no )`)
                .eq('date', date);

            if (error) throw error;
            return res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error executing getAttendance query:', error.message);
        res.status(500).json({ error: 'An internal server error occurred while fetching attendance.' });
    }
};

