
import supabase from '../config/supabaseClient.js';

// @desc    Allocate a room to a student
// @route   POST /api/allocate
// @access  Warden, Admin
export const allocateRoom = async (req, res) => {
    const { roll_no, room_id, allocation_start, allocation_end } = req.body;

    // Optional: Check if the room is already full
    // This would require a more complex query to count current allocations for the room_id

    const { data, error } = await supabase
        .from('ROOM_ALLOC')
        .insert({
            roll_no,
            room_id,
            allocation_start,
            allocation_end
        })
        .select(`
            *,
            STUDENT(name),
            ROOM(room_number, floor, type)
        `);

    if (error) {
        // Check for primary key violation (student already allocated a room)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'This student is already allocated a room for this period.' });
        }
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data[0]);
};

// @desc    Get room allocation details for a specific student
// @route   GET /api/students/:roll_no/allocation
// @access  Warden, Admin, Student (self)
export const getStudentAllocation = async (req, res) => {
    const { roll_no } = req.params;
    const userProfile = req.profile;

    // Security check: A student can only view their own allocation
    if (userProfile.role === 'student' && userProfile.roll_no !== roll_no) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own room allocation.' });
    }

    const { data, error } = await supabase
        .from('ROOM_ALLOC')
        .select(`
            *,
            ROOM(room_number, floor, type)
        `)
        .eq('roll_no', roll_no)
        .order('allocation_start', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    if (data.length === 0) return res.status(404).json({ error: 'No room allocation found for this student.' });
    
    res.status(200).json(data);
};
