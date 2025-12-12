
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student gets their own leave records
// @route   GET /api/leave/my
// @access  Student
export const getMyLeaveRecords = async (req, res) => {
    const studentProfile = req.profile;

    const { data, error } = await supabase
        .from('LEAVE_RECORD')
        .select('*')
        .eq('roll_no', studentProfile.roll_no)
        .order('leave_start_time', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// @desc    Student submits a leave request
// @route   POST /api/leave/my
// @access  Student

export const createLeaveRecord = async (req, res) => {
    const studentProfile = req.user; // attached by middleware
    const { startDate, endDate, startTime, endTime, purpose } = req.body;

    if (!startDate || !endDate || !startTime || !endTime || !purpose) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const { data, error } = await supabase
            .from('leave_record') // make sure table name is correct
            .insert([{
                leave_id: uuidv4(),           // must generate a valid UUID
                roll_no: studentProfile.roll_no,
                leave_start_time: new Date(`${startDate}T${startTime}`),
                leave_end_time: new Date(`${endDate}T${endTime}`),
                reason: purpose,
                approved_by: null
            }])
            .select(); // <-- ensures Supabase returns inserted row in 'data'

        if (error) {
            console.log("Supabase insert error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ error: 'Insert failed, no data returned' });
        }

        res.status(201).json(data[0]);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// @desc    Warden/Admin gets all leave records
// @route   GET /api/leave
// @access  Warden, Admin
export const getAllLeaveRecords = async (req, res) => {
    const { data, error } = await supabase
        .from('leave_record')
        .select(`
            *,
            student ( name, roll_no )
        `)
        .order('leave_start_time', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

export const updateLeaveStatus = async (req, res) => {
  const { leaveId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const updateData = {
    status: action === 'approve' ? 'approved' : 'rejected',
    approved_by: action === 'approve' ? req.user.userId : null, // null for reject
  };

  const { data, error } = await supabase
    .from('leave_record')
    .update(updateData)
    .eq('leave_id', leaveId)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data[0]);
};

export const getLatestLeaveRecord = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leave_record')
      .select(`*, student(name, roll_no)`)
      .order('leave_start_time', { ascending: false })
      .limit(1);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json(data[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Simple leave submission - no heavy authentication
// @route   POST /api/leave/simple
// @access  Public (minimal auth)
export const createLeaveRecordSimple = async (req, res) => {
    const { rollNo, studentName, startDate, endDate, startTime, endTime, purpose } = req.body;

    if (!rollNo || !startDate || !endDate || !startTime || !endTime || !purpose) {
        return res.status(400).json({ error: 'All fields including roll number are required' });
    }

    try {
        // Verify student exists (optional validation)
        const { data: student, error: studentError } = await supabase
            .from('student')
            .select('roll_no, name')
            .eq('roll_no', rollNo)
            .single();

        if (studentError) {
            console.log('Student verification failed:', studentError.message);
            // Continue anyway - don't block leave submission
        }

        const { data, error } = await supabase
            .from('leave_record')
            .insert([{
                leave_id: uuidv4(),
                roll_no: rollNo,
                leave_start_time: new Date(`${startDate}T${startTime}`),
                leave_end_time: new Date(`${endDate}T${endTime}`),
                reason: purpose,
                approved_by: null,
                status: 'pending'
            }])
            .select();

        if (error) {
            console.log("Supabase insert error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ error: 'Insert failed, no data returned' });
        }

        res.status(201).json({
            message: 'Leave submitted successfully!',
            leave: data[0],
            student: studentName,
            rollNo: rollNo
        });
    } catch (err) {
        console.error("Error in simple leave submission:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};