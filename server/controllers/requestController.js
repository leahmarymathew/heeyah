import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student creates a new request/complaint
// @route   POST /api/requests
// @access  Student
export const createRequest = async (req, res) => {
    const { subject, complaint } = req.body;
    // --- THIS IS THE FIX ---
    // Read from req.user (which is attached by protectAndFetchProfile)
    const studentProfile = req.user; 

    if (!subject || !complaint) {
        return res.status(400).json({ error: 'Subject and complaint description are required.' });
    }
    // Safety check for the profile
    if (!studentProfile || !studentProfile.roll_no) {
        console.error('Error in createRequest: req.user is missing or lacks roll_no.');
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
    const studentProfile = req.user;

    if (!studentProfile || !studentProfile.roll_no) {
        console.error('Error in getMyRequests: req.user is missing or lacks roll_no.');
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

// @desc    Simple complaint filing - just use roll number directly
// @route   POST /api/requests/simple
// @access  Public (no auth needed)
export const createSimpleRequest = async (req, res) => {
    const { rollNo, subject, complaint, studentName } = req.body;

    if (!rollNo || !subject || !complaint) {
        return res.status(400).json({ error: 'Roll number, subject and complaint description are required.' });
    }

    try {
        // Verify student exists in student table
        const { data: student, error: studentError } = await supabase
            .from('student')
            .select('roll_no, name')
            .eq('roll_no', rollNo)
            .single();

        if (studentError || !student) {
            return res.status(404).json({ error: 'Student not found with this roll number.' });
        }

        const request_id = `REQ-${uuidv4().slice(0, 6).toUpperCase()}`;

        const { data, error } = await supabase
            .from('request') 
            .insert({
                request_id,
                roll_no: rollNo,
                request_type: subject, 
                description: complaint,
                request_date: new Date().toISOString(),
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;
        
        res.status(201).json({ 
            message: 'Complaint filed successfully!',
            request: data,
            student: student.name,
            rollNo: student.roll_no
        });

    } catch (error) {
        console.error("Error creating simple request:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

