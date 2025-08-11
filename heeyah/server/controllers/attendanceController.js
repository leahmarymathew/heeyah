
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Mark student attendance (out-time or in-time)
// @route   POST /api/attendance
// @access  Caretaker, Warden, Admin
export const markAttendance = async (req, res) => {
    const { roll_no, type } = req.body; // type can be 'out' or 'in'

    if (!['out', 'in'].includes(type)) {
        return res.status(400).json({ error: 'Invalid attendance type. Must be "out" or "in".' });
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

    // Check if an attendance record for this student and date already exists
    const { data: existingRecord, error: findError } = await supabase
        .from('ATTENDANCE')
        .select('*')
        .eq('roll_no', roll_no)
        .eq('date', today)
        .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
        return res.status(400).json({ error: findError.message });
    }

    if (existingRecord) {
        // Update existing record
        const updateData = type === 'out' ? { out_time: new Date() } : { in_time: new Date() };
        const { data, error } = await supabase
            .from('ATTENDANCE')
            .update(updateData)
            .eq('attendance_id', existingRecord.attendance_id)
            .select();
        
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data[0]);

    } else {
        // Create new record
        const attendance_id = `ATT-${uuidv4().slice(0, 6).toUpperCase()}`;
        const insertData = {
            attendance_id,
            roll_no,
            date: today,
            out_time: type === 'out' ? new Date() : null,
            in_time: type === 'in' ? new Date() : null,
        };
        const { data, error } = await supabase
            .from('ATTENDANCE')
            .insert(insertData)
            .select();
        
        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data[0]);
    }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Warden, Admin, Student (for self)
export const getAttendance = async (req, res) => {
    const { date } = req.query;
    const userProfile = req.profile;
    
    let query = supabase.from('ATTENDANCE').select(`*, STUDENT(name, roll_no)`);

    // If a specific date is provided, filter by it
    if (date) {
        query = query.eq('date', date);
    }

    // If the user is a student, they can only see their own records
    if (userProfile.role === 'student') {
        query = query.eq('roll_no', userProfile.roll_no);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};