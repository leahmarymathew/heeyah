
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs

// @desc    Register a new student (and their guardian)
// @route   POST /api/students/register
// @access  Warden
export const registerStudent = async (req, res) => {
  const { 
    email, password, fullName, address, phoneNo, gender,
    guardianName, guardianRelation, guardianPhone 
  } = req.body;
  
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) return res.status(400).json({ error: authError.message });
  if (!authData.user) return res.status(400).json({ error: "Auth user creation failed." });

  const guardian_id = `GUA-${uuidv4().slice(0, 6).toUpperCase()}`;
  const { error: guardianError } = await supabase.from('GUARDIAN').insert({
      guardian_id, guardian_name: guardianName, guardian_relation: guardianRelation, guardian_phone: guardianPhone
  });
  if (guardianError) return res.status(400).json({ error: `Guardian creation failed: ${guardianError.message}` });

  const roll_no = `STU-${uuidv4().slice(0, 6).toUpperCase()}`;
  const { data: studentData, error: studentError } = await supabase.from('STUDENT').insert({
      roll_no, name: fullName, address, phone_no: phoneNo, gender, guardian_id, user_id: authData.user.id
  }).select();
  if (studentError) return res.status(400).json({ error: `Student creation failed: ${studentError.message}` });

  res.status(201).json({ message: 'Student registered successfully', student: studentData[0] });
};
