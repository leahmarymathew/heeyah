import supabase from '../config/supabaseClient.js';

// @desc    Get the most recent leave record for the logged-in student
// @route   GET /api/leaves/recent
// @access  Private (Student)
export const getRecentLeave = async (req, res) => {
    const userProfile = req.profile;

    // This endpoint is only for students
    if (userProfile.role !== 'student') {
        return res.status(403).json({ error: 'Access denied. Only for students.' });
    }

    try {
        // Query the LEAVE table for the student's roll_no
        const { data, error } = await supabase
            .from('leave_record') // Assuming your table is named 'LEAVE'
            .select('leave_start_time', 'status') // Select the start date and status
            .eq('roll_no', userProfile.roll_no) // Match the student's roll number
            .order('start_date', { ascending: false }) // Order by start_date descending to get the most recent first
            .limit(1) // We only want the single most recent record
            .single(); // Expect only one row

        if (error && error.code !== 'PGRST116') { // Ignore 'row not found' error
            throw new Error(error.message);
        }

        res.status(200).json(data); // Send the record back (will be null if none found)

    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};