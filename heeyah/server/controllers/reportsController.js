
import supabase from '../config/supabaseClient.js';

// @desc    Get a summary report of complaints/requests
// @route   GET /api/reports/complaints
// @access  Warden, Admin
export const getComplaintsReport = async (req, res) => {
    const { status } = req.query; // e.g., ?status=pending

    let query = supabase.from('REQUEST').select('*', { count: 'exact' });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ total: count, records: data });
};

// @desc    Get a summary report of attendance
// @route   GET /api/reports/attendance
// @access  Warden, Admin
export const getAttendanceReport = async (req, res) => {
    const { date } = req.query; // e.g., ?date=2025-08-11

    if (!date) {
        return res.status(400).json({ error: "A date query parameter is required." });
    }

    const { data, error } = await supabase
        .from('ATTENDANCE')
        .select(`*, STUDENT(name)`)
        .eq('date', date);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};