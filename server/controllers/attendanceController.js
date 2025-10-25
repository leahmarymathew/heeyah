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
    // Use req.user which contains { userId, role } from your current middleware
    const { userId, role } = req.user; 

    if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required.' });
    }
    
    // --- SAFETY CHECK ---
    // Make sure userId and role are present before proceeding
    if (!userId || !role) { 
        console.error('Error in getAttendance: req.user is missing. Check middleware setup.');
        return res.status(401).json({ error: 'Authentication data missing.' });
    }
    // --- END SAFETY CHECK ---

    try {
        if (role === 'student') {
            // If the user is a student, we first need to find their roll_no using userId
            const { data: studentProfile, error: profileError } = await supabase
                .from('student') // Assuming lowercase table name
                .select('roll_no')
                .eq('user_id', userId)
                .single();

            // --- IMPROVED CHECK ---
            if (profileError || !studentProfile || !studentProfile.roll_no) {
                console.error(`Student profile or roll_no not found for user ID: ${userId}`, profileError);
                console.log("Profile data found:", studentProfile);
                return res.status(404).json({ error: 'Student profile or roll number not found.' });
            }
            // --- END IMPROVED CHECK ---

            // Now fetch the attendance for that student's roll_no
            const { data, error } = await supabase
                .from('attendance') // Assuming lowercase table name
                .select('in_time, out_time')
                .eq('roll_no', studentProfile.roll_no)
                .eq('date', date)
                .single();

            // Ignore "no rows found" error, just return null
            if (error && error.code !== 'PGRST116') {
                throw error;
            }
            
            return res.status(200).json(data);

        } else {
            // Wardens/Admins can see all records for a given date
            const { data, error } = await supabase
                .from('attendance') // Assuming lowercase table name
                .select(`*, student ( name, roll_no )`) // Assuming lowercase table name
                .eq('date', date);

            if (error) throw error;
            return res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error executing getAttendance query:', error.message);
        res.status(500).json({ error: 'An internal server error occurred while fetching attendance.' });
    }
};

