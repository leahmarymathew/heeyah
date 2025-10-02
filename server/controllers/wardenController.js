import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Register a new warden
// @route   POST /api/wardens/register
// @access  Admin
export const registerWarden = async (req, res) => {
  const { email, password, fullName, phoneNo } = req.body;

  if (!email || !password || !fullName || !phoneNo) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Step 1: Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return res.status(400).json({ error: authError.message });
  if (!authData.user) return res.status(400).json({ error: 'Auth user creation failed.' });

  // Step 2: Create the Warden record
  const warden_id = `WARD-${uuidv4().slice(0, 5).toUpperCase()}`;
  const { data, error } = await supabase
    .from('WARDEN')
    .insert({
      warden_id,
      name: fullName,
      email,
      phone_no: phoneNo,
      user_id: authData.user.id,
    })
    .select();

  if (error) {
    return res.status(400).json({ error: `Warden profile creation failed: ${error.message}` });
  }

  return res.status(201).json({ message: 'Warden registered successfully', warden: data[0] });
};
