import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Student allocates a room/bed to themselves
// @route   POST /api/allocate/request
// @access  Student
export const requestRoomAllocation = async (req, res) => {
    // --- THIS IS THE FIX ---
    // We change 'room_number' to 'room_id' to match what the frontend is sending.
    // We also rename it to 'room_number' so the rest of the function works.
    const { room_id: room_number, bed_number } = req.body; 
    const studentProfile = req.profile; 

    if (!room_number || !bed_number) {
        return res.status(400).json({ error: 'Room Number and Bed Number are required.' });
    }
    if (!studentProfile || !studentProfile.roll_no) {
        return res.status(401).json({ error: 'Student profile not found.' });
    }

    try {
        // --- NEW STEP ---
        // 1. Find the real room_id from the room_number
        const { data: room, error: roomError } = await supabase
            .from('room')
            .select('room_id, capacity') // Also grab capacity
            .eq('room_number', room_number)
            .single();
            
        if (roomError || !room) {
            return res.status(404).json({ error: `Room with number ${room_number} not found.`});
        }
        
        const actual_room_id = room.room_id; // This is the real ID (e.g., 'R101')
        const capacity = room.capacity;
        // --- END NEW STEP ---


        // 2. Check if student already has an approved allocation
        const { data: existing, error: existingError } = await supabase
            .from('room_alloc')
            .select('assignment_id')
            .eq('roll_no', studentProfile.roll_no)
            .eq('status', 'approved')
            .limit(1);

        if (existingError) throw existingError;
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You already have an approved room allocation.' });
        }
        
        // 3. Check if the specific bed is already taken
        const { data: bedTaken, error: bedError } = await supabase
            .from('room_alloc')
            .select('assignment_id')
            .eq('room_id', actual_room_id) // Use the real room_id
            .eq('bed_number', bed_number)
            .in('status', ['pending', 'approved']) 
            .limit(1);
            
        if (bedError) throw bedError;
        if (bedTaken.length > 0) {
            return res.status(400).json({ error: 'This bed has already been requested or allocated.' });
        }

        // 4. Check if the room is full
        const { data: allocsInRoom, error: countError } = await supabase
            .from('room_alloc')
            .select('assignment_id', { count: 'exact' })
            .eq('room_id', actual_room_id)
            .in('status', ['pending', 'approved']);

        if (countError) throw countError;
        if (allocsInRoom.length >= capacity) {
            return res.status(400).json({ error: 'This room is already full.' });
        }
        
        // 5. Create a new 'approved' allocation
        const { data, error } = await supabase
            .from('room_alloc')
            .insert({
                roll_no: studentProfile.roll_no,
                room_id: actual_room_id, // Use the real room_id
                bed_number: bed_number,
                status: 'approved'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Room allocated successfully!', allocation: data });

    } catch (error) {
        console.error("Error in requestRoomAllocation:", error.message);
        res.status(500).json({ error: 'Failed to allocate room.' });
    }
};

// @desc    Student views their own allocation status
// @route   GET /api/allocate/my-status
// @access  Student
export const getMyAllocationStatus = async (req, res) => {
    const studentProfile = req.profile;

    if (!studentProfile || !studentProfile.roll_no) {
        return res.status(401).json({ error: 'Student profile not found.' });
    }
    
    try {
        const { data, error } = await supabase
            .from('room_alloc')
            .select('*, room(room_number, floor)') // Join with room table
            .eq('roll_no', studentProfile.roll_no)
            .order('allocation_start', { ascending: false })
            .limit(1);

        if (error) throw error;
        res.status(200).json(data); 

    } catch (error) {
        console.error("Error in getMyAllocationStatus:", error.message);
        res.status(500).json({ error: 'Failed to get allocation status.' });
    }
};

