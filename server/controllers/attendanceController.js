import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Mark student attendance (out-time or in-time)
 * @route   POST /api/attendance
 * @access  Caretaker, Warden, Admin
 */
export const markAttendance = async (req, res) => {
    const { roll_no, type } = req.body; // type can be 'out' or 'in'

    if (!roll_no || !type || !['in', 'out'].includes(type)) {
        return res.status(400).json({ error: 'Student roll_no and type (\'in\' or \'out\') are required.' });
    }

    const today = new Date().toISOString().slice(0, 10); // Get date in YYYY-MM-DD format (UTC)

    try {
        // Check if a record for this student and date already exists
        const { data: existingRecord, error: findError } = await supabase
            .from('ATTENDANCE') // <-- Corrected to uppercase
            .select('*')
            .eq('roll_no', roll_no)
            .eq('date', today)
            .single();

        // Handle errors, but ignore PGRST116 (no rows found), which is expected
        if (findError && findError.code !== 'PGRST116') {
            throw findError;
        }

        if (existingRecord) {
            // If a record exists, update it
            const updateField = type === 'in' ? 'in_time' : 'out_time';
            const { data, error } = await supabase
                .from('ATTENDANCE') // <-- Corrected to uppercase
                .update({ [updateField]: new Date().toISOString() })
                .eq('attendance_id', existingRecord.attendance_id)
                .select()
                .single();

            if (error) throw error;
            res.status(200).json({ message: 'Attendance updated successfully', record: data });

        } else {
            // If no record exists, create a new one
            if (type === 'out') {
                return res.status(400).json({ error: 'Cannot mark Out time for a new record. Mark In time first.' });
            }
            
            const attendance_id = `ATT-${uuidv4().slice(0, 6).toUpperCase()}`;
            const { data, error } = await supabase
                .from('ATTENDANCE') // <-- Corrected to uppercase
                .insert({
                    attendance_id,
                    roll_no,
                    date: today,
                    in_time: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            res.status(201).json({ message: 'Attendance marked successfully', record: data });
        }
    } catch (error) {
        console.error('Error in markAttendance:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};


/**
 * @desc    Get attendance records for a specific date
 * @route   GET /api/attendance
 * @access  Warden, Admin, Student (for self)
 */
export const getAttendance = async (req, res) => {
    const { date } = req.query;
    const userProfile = req.profile; // Attached by checkRole middleware

    // --- NEW SAFETY CHECK ---
    // This will prevent the crash and send a clear error message.
    if (!userProfile) {
        console.error('Error in getAttendance: req.profile is missing. Check middleware setup.');
        return res.status(500).json({ error: 'Server configuration error: User profile not found.' });
    }
    // -------------------------

    if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required.' });
    }

    try {
        if (userProfile.role === 'student') {
            // Students can only fetch their own record for a specific date
            const { data, error } = await supabase
                .from('ATTENDANCE') // <-- Corrected to uppercase
                .select('in_time, out_time')
                .eq('roll_no', userProfile.roll_no)
                .eq('date', date)
                .single();

            // Ignore "no rows found" error, just return null
            if (error && error.code !== 'PGRST116') {
                throw error;
            }
            
            // If data is null (no record found), the frontend will handle it
            return res.status(200).json(data);

        } else {
            // Wardens/Admins can see all records for a given date
            const { data, error } = await supabase
                .from('ATTENDANCE') // <-- Corrected to uppercase
                .select(`
                    *,
                    STUDENT ( name, roll_no ) 
                `) // <-- Corrected to uppercase
                .eq('date', date);

            if (error) throw error;
            return res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error in getAttendance:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

