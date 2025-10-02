import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student creates a new request/complaint
// @route   POST /api/requests
// @access  Student
export const createRequest = async (req, res) => {
    // This is the updated list of fields from your new form
    const { firstName, lastName, email, phone, subject, complaint, isAnonymous } = req.body;
    const studentProfile = req.profile; // Attached by the checkRole middleware

    if (!subject || !complaint) {
        return res.status(400).json({ error: 'Subject and complaint description are required.' });
    }

    try {
        const request_id = `REQ-${uuidv4().slice(0, 6).toUpperCase()}`;

        const { data, error } = await supabase
            .from('REQUEST')
            .insert({
                request_id,
                roll_no: studentProfile.roll_no,
                request_type: subject, // Using 'subject' from the form as the 'request_type'
                description: complaint,
                request_date: new Date().toISOString(),
                status: 'pending',
                // You may want to add columns in your DB to store these extra details
                // for now, we are not saving firstName, email etc. as they are not in the REQUEST table
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
    const studentProfile = req.profile;

    try {
        const { data, error } = await supabase
            .from('REQUEST')
            .select('*')
            .eq('roll_no', studentProfile.roll_no)
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
            .from('REQUEST')
            .select('*, STUDENT(name, roll_no)')
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
            .from('REQUEST')
            .update({ status })
            .eq('request_id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        console.error("Error updating request status:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};
