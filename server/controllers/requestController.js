import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student creates a new request/complaint
// @route   POST /api/requests
// @access  Student
export const createRequest = async (req, res) => {
    const { subject, complaint } = req.body;
    // --- THIS IS THE FIX ---
    // Read from req.profile (which is attached by protectAndFetchProfile)
    const studentProfile = req.profile; 

    if (!subject || !complaint) {
        return res.status(400).json({ error: 'Subject and complaint description are required.' });
    }
    // Safety check for the profile
    if (!studentProfile || !studentProfile.roll_no) {
        console.error('Error in createRequest: req.profile is missing or lacks roll_no.');
        return res.status(401).json({ error: 'Authentication data or student profile missing.' });
    }

    try {
        const request_id = `REQ-${uuidv4().slice(0, 6).toUpperCase()}`;

        const { data, error } = await supabase
            .from('request') 
            .insert({
                request_id,
                roll_no: studentProfile.roll_no, // Use the roll_no from the profile
                request_type: subject, 
                description: complaint,
                request_date: new Date().toISOString(),
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);

    } catch (error) {
        console.error("Error creating request:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// @desc    Student gets their own requests
// @route   GET /api/requests/my
// @access  Student
export const getMyRequests = async (req, res) => {
    // --- THIS IS THE FIX ---
    const studentProfile = req.profile;

    if (!studentProfile || !studentProfile.roll_no) {
        console.error('Error in getMyRequests: req.profile is missing or lacks roll_no.');
        return res.status(401).json({ error: 'Authentication data or student profile missing.' });
    }

    try {
        const { data, error } = await supabase
            .from('request') 
            .select('*')
            .eq('roll_no', studentProfile.roll_no) // Use the roll_no from the profile
            .order('request_date', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching student's requests:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// @desc    Warden gets all requests
// @route   GET /api/requests
// @access  Warden, Admin
export const getAllRequests = async (req, res) => {
     try {
        const { data, error } = await supabase
            .from('request') 
            .select('*, student(name, roll_no)') 
            .order('request_date', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching all requests:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// @desc    Warden updates a request status
// @route   PUT /api/requests/:id/status
// @access  Warden, Admin
export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status provided.' });
    }

    try {
        const { data, error } = await supabase
            .from('request') 
            .update({ status })
            .eq('request_id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        console.error("Error updating request status:", error.message);
        // --- THIS IS THE FIX ---
        // Changed "5G00" to "500"
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

