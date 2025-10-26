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
            // Update the existing record
            const updateField = type === 'in' ? 'in_time' : 'out_time';
            const { data, error } = await supabase
                .from('attendance') 
                .update({ [updateField]: new Date().toISOString() })
                .eq('attendance_id', existingRecord.attendance_id)
                .select().single();

            if (error) throw error;
            res.status(200).json({ message: 'Attendance updated', record: data });

        } else {
            // Create a new record, allow both in/out as first action
            const attendance_id = `ATT-${uuidv4().slice(0, 6).toUpperCase()}`;
            const insertData = {
                attendance_id,
                roll_no,
                date: today,
                in_time: type === 'in' ? new Date().toISOString() : null,
                out_time: type === 'out' ? new Date().toISOString() : null
            };

            const { data, error } = await supabase
                .from('attendance') 
                .insert(insertData)
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
    const { userId, role } = req.user;

    if (!date) return res.status(400).json({ error: 'Date query parameter is required.' });
    if (!userId || !role) return res.status(401).json({ error: 'Authentication data missing.' });

    try {
        if (role === 'admin') { // role should student change it
            const { data: studentProfile, error: profileError } = await supabase
                .from('student')
                .select('roll_no')
                .eq('user_id', userId)
                .single();

            if (profileError || !studentProfile?.roll_no) {
                return res.status(404).json({ error: 'Student profile or roll number not found.' });
            }

            const { data, error } = await supabase
                .from('attendance')
                .select('attendance_id, in_time, out_time, status')
                .eq('roll_no', studentProfile.roll_no)
                .eq('date', date);

            if (error) throw error;
            return res.status(200).json(data || []);

        } else if (role === 'warden' || role === 'student') { // student shouldd chanfge to admin
            const { data, error } = await supabase
                .from('attendance')
                .select('attendance_id, in_time, out_time, status, student(name, roll_no)')
                .eq('date', date);

            if (error) throw error;
            return res.status(200).json(data || []);
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Internal server error while fetching attendance.' });
    }
};
