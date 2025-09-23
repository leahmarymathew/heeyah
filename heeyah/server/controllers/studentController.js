
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const registerStudent = async (req, res) => {
    const { email, password, fullName, ...rest } = req.body;

    // 1. Create the user in your 'users' table with the plain text password
    const user_id = `USER-${uuidv4().slice(0, 8).toUpperCase()}`;
    const { error: userError } = await supabase.from('users').insert({
        user_id,
        email,
        password: password, // Storing password directly
        role: 'student'
    });

    if (userError) return res.status(400).json({ error: `User creation failed: ${userError.message}` });

    // 2. Create the guardian and student profiles (same as before)
    const guardian_id = `GUA-${uuidv4().slice(0, 6).toUpperCase()}`;
    const { error: guardianError } = await supabase.from('GUARDIAN').insert({
        guardian_id, guardian_name: rest.guardianName, guardian_relation: rest.guardianRelation, guardian_phone: rest.guardianPhone
    });
    if (guardianError) return res.status(400).json({ error: `Guardian creation failed: ${guardianError.message}` });

    const roll_no = `STU-${uuidv4().slice(0, 6).toUpperCase()}`;
    const { data: studentData, error: studentError } = await supabase.from('STUDENT').insert({
        roll_no, name: fullName, address: rest.address, phone_no: rest.phoneNo, gender: rest.gender, guardian_id, user_id
    }).select();
    if (studentError) return res.status(400).json({ error: `Student creation failed: ${studentError.message}` });

    res.status(201).json({ message: 'Student registered successfully', student: studentData[0] });
};
