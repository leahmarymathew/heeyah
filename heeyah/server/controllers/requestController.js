
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student creates a new request (complaint)
// @route   POST /api/requests
// @access  Student
export const createRequest = async (req, res) => {
    const { request_type, description } = req.body;
    const studentProfile = req.profile; // Attached by checkRole middleware

    const request_id = `REQ-${uuidv4().slice(0, 6).toUpperCase()}`;
3
    const { data, error } = await supabase
        .from('REQUEST')
        .insert({
            request_id,
            roll_no: studentProfile.roll_no,
            request_type,
            description,
            request_date: new Date(),
            status: 'pending'
        })
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};

// @desc    Student gets their own requests
// @route   GET /api/requests/my
// @access  Student
export const getMyRequests = async (req, res) => {
    const studentProfile = req.profile;

    const { data, error } = await supabase
        .from('REQUEST')
        .select('*')
        .eq('roll_no', studentProfile.roll_no)
        .order('request_date', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// @desc    Warden/Admin gets all requests
// @route   GET /api/requests
// @access  Warden, Admin
export const getAllRequests = async (req, res) => {
    const { data, error } = await supabase
        .from('REQUEST')
        .select(`
            *,
            STUDENT ( name, roll_no )
        `)
        .order('request_date', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// @desc    Warden/Admin updates a request's status
// @route   PUT /api/requests/:id
// @access  Warden, Admin
export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status provided.' });
    }

    const { data, error } = await supabase
        .from('REQUEST')
        .update({ status })
        .eq('request_id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (data.length === 0) return res.status(404).json({ error: 'Request not found.' });
    
    res.status(200).json(data[0]);
};