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
    const studentProfile = req.user; 

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
            .select('assignment_id, room_id, bed_number, room(room_number)')
            .eq('roll_no', studentProfile.roll_no)
            .eq('status', 'approved')
            .limit(1);

        if (existingError) throw existingError;
        if (existing.length > 0) {
            const existingRoom = existing[0];
            return res.status(400).json({ 
                error: 'You already have an approved room allocation.',
                existingAllocation: {
                    roomNumber: existingRoom.room.room_number,
                    bedNumber: existingRoom.bed_number
                }
            });
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
    const studentProfile = req.user;

    if (!studentProfile || !studentProfile.roll_no) {
        return res.status(401).json({ error: 'Student profile not found.' });
    }
    
    try {
        const { data, error } = await supabase
            .from('room_alloc')
            .select('*, room(room_number, floor)') // Join with room table
            .eq('roll_no', studentProfile.roll_no)
            .eq('status', 'approved')
            .order('allocation_start', { ascending: false })
            .limit(1);

        if (error) throw error;
        
        if (data.length > 0) {
            res.status(200).json({ 
                hasAllocation: true,
                allocation: {
                    roomNumber: data[0].room.room_number,
                    bedNumber: data[0].bed_number,
                    floor: data[0].room.floor,
                    status: data[0].status
                }
            });
        } else {
            res.status(200).json({ 
                hasAllocation: false,
                allocation: null
            });
        }

    } catch (error) {
        console.error("Error in getMyAllocationStatus:", error.message);
        res.status(500).json({ error: 'Failed to get allocation status.' });
    }
};

// @desc    Warden removes a student from a room
// @route   DELETE /api/allocate/remove
// @access  Warden
export const removeStudentFromRoom = async (req, res) => {
    const { rollNo, roomId } = req.body;
    const wardenProfile = req.user;

    if (!rollNo || !roomId) {
        return res.status(400).json({ error: 'Roll number and room ID are required.' });
    }

    if (!wardenProfile || wardenProfile.role !== 'warden') {
        return res.status(403).json({ error: 'Only wardens can remove students from rooms.' });
    }

    try {
        // Find the room by room number to get the actual room_id
        const { data: room, error: roomError } = await supabase
            .from('room')
            .select('room_id')
            .eq('room_number', roomId)
            .single();

        if (roomError || !room) {
            return res.status(404).json({ error: `Room ${roomId} not found.` });
        }

        // Find and delete the allocation
        const { data: allocation, error: findError } = await supabase
            .from('room_alloc')
            .select('assignment_id')
            .eq('roll_no', rollNo)
            .eq('room_id', room.room_id)
            .eq('status', 'approved')
            .single();

        if (findError || !allocation) {
            return res.status(404).json({ error: 'Student allocation not found in this room.' });
        }

        // Delete the allocation
        const { error: deleteError } = await supabase
            .from('room_alloc')
            .delete()
            .eq('assignment_id', allocation.assignment_id);

        if (deleteError) throw deleteError;

        res.status(200).json({ message: `Student ${rollNo} has been removed from room ${roomId} successfully.` });

    } catch (error) {
        console.error("Error in removeStudentFromRoom:", error.message);
        res.status(500).json({ error: 'Failed to remove student from room.' });
    }
};

// @desc    Simple room allocation - just insert into room_alloc table using roll number
// @route   POST /api/allocate/request/simple
// @access  Public (minimal auth)
export const requestRoomAllocationSimple = async (req, res) => {
    const { room_id, bed_number, rollNo, studentName } = req.body;

    if (!room_id || !bed_number || !rollNo) {
        return res.status(400).json({ error: 'Room ID, bed number, and roll number are required.' });
    }

    try {
        // 1. Find the real room_id from the room_number
        const { data: room, error: roomError } = await supabase
            .from('room')
            .select('room_id, capacity')
            .eq('room_number', room_id)
            .single();
            
        if (roomError || !room) {
            return res.status(404).json({ error: `Room with number ${room_id} not found.`});
        }
        
        const actual_room_id = room.room_id;
        const capacity = room.capacity || 3;

        // 2. Check if student already has an approved allocation
        const { data: existing, error: existingError } = await supabase
            .from('room_alloc')
            .select('assignment_id, room_id, bed_number, room(room_number)')
            .eq('roll_no', rollNo)
            .eq('status', 'approved')
            .limit(1);

        if (existingError) {
            console.error('Error checking existing allocation:', existingError);
        }
        
        if (existing && existing.length > 0) {
            const existingRoom = existing[0];
            return res.status(400).json({ 
                error: 'You already have an approved room allocation.',
                existingAllocation: {
                    roomNumber: existingRoom.room?.room_number || 'Unknown',
                    bedNumber: existingRoom.bed_number
                }
            });
        }
        
        // 3. Check if the specific bed is already taken
        const { data: bedTaken, error: bedError } = await supabase
            .from('room_alloc')
            .select('assignment_id')
            .eq('room_id', actual_room_id)
            .eq('bed_number', bed_number)
            .in('status', ['pending', 'approved']) 
            .limit(1);
            
        if (bedError) {
            console.error('Error checking bed availability:', bedError);
        }
        
        if (bedTaken && bedTaken.length > 0) {
            return res.status(400).json({ error: 'This bed has already been requested or allocated.' });
        }

        // 4. Check if the room is full
        const { data: allocsInRoom, error: countError } = await supabase
            .from('room_alloc')
            .select('assignment_id')
            .eq('room_id', actual_room_id)
            .in('status', ['pending', 'approved']);

        if (countError) {
            console.error('Error checking room capacity:', countError);
        }
        
        if (allocsInRoom && allocsInRoom.length >= capacity) {
            return res.status(400).json({ error: 'This room is already full.' });
        }
        
        // 5. Create a new 'approved' allocation
        const { data, error } = await supabase
            .from('room_alloc')
            .insert({
                roll_no: rollNo,
                room_id: actual_room_id,
                bed_number: bed_number,
                status: 'approved'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating allocation:', error);
            return res.status(500).json({ error: 'Failed to create room allocation.' });
        }
        
        res.status(201).json({ 
            message: 'Room allocated successfully!', 
            allocation: data,
            student: studentName,
            rollNo: rollNo
        });

    } catch (error) {
        console.error("Error in requestRoomAllocationSimple:", error.message);
        res.status(500).json({ error: 'Failed to allocate room.' });
    }
};

// @desc    Simple allocation status check - no heavy auth
// @route   GET /api/allocate/my-status/simple
// @access  Public (minimal auth)
export const getMyAllocationStatusSimple = async (req, res) => {
    const { rollNo, userRole } = req.query;

    if (!rollNo || !userRole) {
        return res.status(400).json({ error: 'Roll number and user role are required.' });
    }
    
    try {
        const { data, error } = await supabase
            .from('room_alloc')
            .select('*, room(room_number, floor)')
            .eq('roll_no', rollNo)
            .eq('status', 'approved')
            .order('allocation_start', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching allocation status:', error);
            return res.status(500).json({ error: 'Failed to get allocation status.' });
        }
        
        if (data && data.length > 0) {
            res.status(200).json({ 
                hasAllocation: true,
                allocation: {
                    roomNumber: data[0].room?.room_number || 'Unknown',
                    bedNumber: data[0].bed_number,
                    floor: data[0].room?.floor || 'Unknown',
                    status: data[0].status
                }
            });
        } else {
            res.status(200).json({ 
                hasAllocation: false,
                allocation: null
            });
        }

    } catch (error) {
        console.error("Error in getMyAllocationStatusSimple:", error.message);
        res.status(500).json({ error: 'Failed to get allocation status.' });
    }
};

