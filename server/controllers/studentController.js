import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// Note: Now using database instead of in-memory storage

// @desc    Register a new student
// @route   POST /api/students/register
export const registerStudent = async (req, res) => {
    const { email, password, fullName, address, phoneNo, gender, guardianName, guardianRelation, guardianPhone, hostelId } = req.body;

    // --- 1. Create Supabase Auth User ---
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });
    if (authError) return res.status(400).json({ error: authError.message });
    if (!authData.user) return res.status(500).json({ error: 'Failed to create auth user.' });

    const userId = authData.user.id;

    try {
        // --- 2. Create Guardian ---
        const guardian_id = `G-${uuidv4().slice(0, 7).toUpperCase()}`;
        const { error: guardianError } = await supabase.from('guardian').insert({
            guardian_id, guardian_name: guardianName, guardian_relation: guardianRelation, guardian_phone: guardianPhone
        });
        if (guardianError) throw guardianError;

        // --- 3. Create Student Profile ---
        const roll_no = `S-${uuidv4().slice(0, 7).toUpperCase()}`;
        const { data: studentData, error: studentError } = await supabase
            .from('student')
            .insert({
                roll_no,
                user_id: userId,
                name: fullName,
                address,
                phone_no: phoneNo,
                gender,
                guardian_id,
                hostel_id: hostelId // Make sure this hostel_id exists in your 'hostel' table
            })
            .select()
            .single();
        
        if (studentError) throw studentError;
        
        res.status(201).json({ message: 'Student registered successfully', student: studentData });

    } catch (error) {
        // If profile creation fails, delete the orphaned auth user
        await supabase.auth.admin.deleteUser(userId);
        console.error('Error in student registration:', error.message);
        res.status(500).json({ error: 'Failed to create student profile.', details: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Warden, Admin
export const getAllStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('student')
            .select('roll_no, name, phone_no, hostel_id'); // Select only the fields you need for the list
        
        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        console.error('Error in getAllStudents:', error.message);
        res.status(500).json({ error: 'Failed to fetch students.' });
    }
};


/**
 * @desc    Get all lost & found items
 * @route   GET /api/students/lost-and-found
 * @access  Public / Student
 */
export const getLostAndFoundItems = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('lost_and_found')
            .select(`
                item_id,
                item_name,
                last_known_location,
                last_seen_datetime,
                image_url,
                is_anonymous,
                reported_by,
                reported_at,
                status
            `)
            .order('last_seen_datetime', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to fetch lost & found items' });
        }

        // Transform data for frontend
        const transformedData = data.map(item => ({
            id: item.item_id,
            itemName: item.item_name,
            lastKnownLocation: item.last_known_location,
            lastSeenDate: item.last_seen_datetime, // keep raw, React will format
            lastSeenTime: item.last_seen_datetime, // keep raw, React will format
            photo: item.image_url,
            name: item.is_anonymous ? 'Anonymous' : (item.reported_by || 'Unknown'),
            phone: item.is_anonymous ? 'N/A' : null, // Add phone if you have a students table
            status: item.status,
            reportedAt: item.reported_at
        }));

        return res.json(transformedData);

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Simple attendance fetch - no heavy authentication
 * @route   POST /api/students/attendance/simple
 * @access  Public (minimal auth)
 */
export const getAttendanceSimple = async (req, res) => {
    const { rollNo, studentName } = req.body;

    if (!rollNo) {
        return res.status(400).json({ error: 'Roll number is required.' });
    }

    try {
        // Handle both old and new roll numbers for backward compatibility
        const normalizedRollNo = rollNo === 'TEST-STUDENT' ? 'TEST-STU' : rollNo;
        
        // Get attendance from database
        const { data: attendanceData, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('roll_no', normalizedRollNo)
            .order('date', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Failed to fetch attendance data.' });
        }

        res.status(200).json(attendanceData || []);

    } catch (error) {
        console.error("Error in simple attendance fetch:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

/**
 * @desc    Simple attendance marking - no heavy authentication
 * @route   POST /api/students/attendance/mark
 * @access  Public (minimal auth)
 */
export const markAttendanceSimple = async (req, res) => {
    const { rollNo, studentName, type } = req.body;

    console.log('Attendance request:', { rollNo, studentName, type });

    if (!rollNo || !type) {
        return res.status(400).json({ error: 'Roll number and type are required.' });
    }

    if (!['in', 'out'].includes(type)) {
        return res.status(400).json({ error: 'Type must be "in" or "out".' });
    }

    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const currentTime = new Date().toISOString();
        
        // Handle both old and new roll numbers for backward compatibility
        const normalizedRollNo = rollNo === 'TEST-STUDENT' ? 'TEST-STU' : rollNo;

        // Create simple attendance record with shorter ID
        const shortId = Date.now().toString().slice(-8); // Use last 8 digits of timestamp
        const attendanceRecord = {
            attendance_id: shortId,
            roll_no: normalizedRollNo.substring(0, 10), // Ensure roll_no fits in 10 chars
            date: today,
            in_time: type === 'in' ? currentTime : null,
            out_time: type === 'out' ? currentTime : null
        };

        console.log('Inserting attendance record:', attendanceRecord);

        const { data, error } = await supabase
            .from('attendance')
            .insert([attendanceRecord]);

        if (error) {
            console.error('Database insert error:', error);
            return res.status(500).json({ error: 'Failed to save attendance: ' + error.message });
        }

        console.log('Attendance saved successfully:', data);

        res.status(200).json({ 
            success: true, 
            message: `${type === 'in' ? 'Check-in' : 'Check-out'} successful`
        });

    } catch (error) {
        console.error("Error in simple attendance marking:", error);
        res.status(500).json({ error: 'An internal server error occurred: ' + error.message });
    }
};
