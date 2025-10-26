import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all rooms (basic list)
// @route   GET /api/rooms
export const getAllRooms = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('room') // Assuming lowercase
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getAllRooms:", error.message);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// @desc    Create a new room
// @route   POST /api/rooms
// --- THIS IS THE EXPORT YOU ARE MISSING ---
export const createRoom = async (req, res) => {
    const { room_number, floor, type, hostel_id, capacity, hostel_wing } = req.body;
    
    if (!room_number || !floor || !type || !hostel_id || !capacity || !hostel_wing) {
        return res.status(400).json({ error: 'All fields (room_number, floor, type, hostel_id, capacity, hostel_wing) are required.' });
    }

    try {
        const room_id = `R-${uuidv4().slice(0, 7).toUpperCase()}`;
        const { data, error } = await supabase
            .from('room') // Assuming lowercase
            .insert({ room_id, room_number, floor, type, hostel_id, capacity, hostel_wing })
            .select()
            .single();
            
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error("Error in createRoom:", error.message);
        res.status(500).json({ error: 'Failed to create room' });
    }
};


// @desc    Get room layout for the allocation page
// @route   GET /api/rooms/layout
export const getRoomLayout = async (req, res) => {
    const { floor, search } = req.query;

    try {
        let roomQuery = supabase
            .from('room') 
            .select('room_id, room_number, floor, hostel_wing, capacity')
            .eq('floor', floor);
            
        if (search) {
            roomQuery = roomQuery.ilike('room_number', `%${search}%`);
        }
        
        const { data: rooms, error: roomError } = await roomQuery;
        if (roomError) throw roomError;

        const { data: allocations, error: allocError } = await supabase
            .from('room_alloc') 
            .select('room_id, roll_no, status')
            .in('status', ['approved', 'pending']);
            
        if (allocError) throw allocError;

        const transformedRooms = rooms.map(room => {
            const wing = room.hostel_wing; 
            const roomAllocations = allocations.filter(a => a.room_id === room.room_id);
            const allocationCount = roomAllocations.length;
            const capacity = room.capacity || 3; 
            let status;
            if (allocationCount === 0) {
                status = 'Available';
            } else if (allocationCount >= capacity) {
                status = 'Reserved';
            } else {
                status = 'Partial';
            }

            return {
                id: room.room_number,
                status: status,
                wing: wing
            };
        });

        res.status(200).json(transformedRooms);

    } catch (error) {
        console.error("Error in getRoomLayout:", error.message);
        res.status(500).json({ error: 'Failed to get room layout' });
    }
};

// @desc    Get detailed info for one room, transformed for the overlay
// @route   GET /api/rooms/layout/:id
export const getRoomDetails = async (req, res) => {
    const { id } = req.params; 

    try {
        const { data: room, error: roomError } = await supabase
            .from('room') 
            .select('room_id, room_number, type, capacity')
            .eq('room_number', id) 
            .single();

        if (roomError) {
            console.error(`Room not found for room_number: ${id}`, roomError.message);
            return res.status(404).json({ error: 'Room not found.' });
        }

        const { data: allocations, error: allocError } = await supabase
            .from('room_alloc')
            .select('student ( name, roll_no )') 
            .eq('room_id', room.room_id) 
            .eq('status', 'approved'); 
        if (allocError) throw allocError;

        const beds = [];
        const capacity = room.capacity || 3; 
        
        for (let i = 0; i < allocations.length; i++) {
            beds.push({
                id: i + 1,
                occupied: true,
                name: allocations[i].student.name,
                rollNo: allocations[i].student.roll_no
            });
        }
        
        while (beds.length < capacity) {
            beds.push({
                id: beds.length + 1,
                occupied: false,
                name: 'Free space',
                rollNo: null
            });
        }

        res.status(200).json({
            roomName: room.room_number,
            capacity: capacity,
            beds: beds
        });

    } catch (error) {
        console.error("Error in getRoomDetails:", error.message);
        res.status(500).json({ error: 'Failed to get room details' });
    }
};

