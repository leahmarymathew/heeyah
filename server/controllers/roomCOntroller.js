
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all rooms
// @route   GET /api/rooms
export const getAllRooms = async (req, res) => {
  const { data, error } = await supabase.from('ROOM').select('*').order('room_number', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

// @desc    Create a new room
// @route   POST /api/rooms
export const createRoom = async (req, res) => {
  const { room_number, floor, type } = req.body;
  const room_id = `ROOM-${uuidv4().slice(0, 5).toUpperCase()}`;
  
  const { data, error } = await supabase.from('ROOM').insert([{ room_id, room_number, floor, type }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};