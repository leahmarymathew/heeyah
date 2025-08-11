
import supabase from '../config/supabaseClient.js';

export const findUserProfile = async (userId) => {
  const [student, warden, caretaker] = await Promise.all([
    supabase.from('STUDENT').select('*').eq('user_id', userId).single(),
    supabase.from('WARDEN').select('*').eq('user_id', userId).single(),
    supabase.from('CARETAKER').select('*').eq('user_id', userId).single()
  ]);

  if (student.data) return { ...student.data, role: 'student' };
  if (warden.data) return { ...warden.data, role: 'warden' };
  if (caretaker.data) return { ...caretaker.data, role: 'caretaker' };
  
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (user?.user_metadata?.role === 'admin') {
      return { email: user.email, role: 'admin', name: 'Admin User' };
  }
  return null;
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({ email, password });

  if (sessionError) return res.status(400).json({ error: sessionError.message });
  if (!sessionData.user) return res.status(400).json({ error: "Login failed." });

  const userProfile = await findUserProfile(sessionData.user.id);
  if (!userProfile) return res.status(404).json({ error: "User authenticated but no profile found." });

  res.status(200).json({ session: sessionData.session, user: userProfile });
};
