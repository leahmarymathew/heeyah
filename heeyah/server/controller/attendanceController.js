import supabase from '../config/supabaseClient.js';

// Helper to get date in 'YYYY-MM-DD' format for IST
const getTodayDateString = () => {
    const today = new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(today);
    const { year, month, day } = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return `${year}-${month}-${day}`;
};

// Helper to get time in 'HH:MM AM/PM' format for IST
const getTodayTimeString = () => {
    const today = new Date();
    return today.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const getAttendance = async (req, res) => {
    const userProfile = req.profile;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required.' });
    }

    if (userProfile.role === 'student') {
        const { data, error } = await supabase
            .from('attendance')
            .select('in_time, out_time')
            .eq('roll_no', userProfile.roll_no)
            .eq('date', date)
            .single();

        if (error && error.code !== 'PGRST116') {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json(data);
    } else {
      res.status(200).json({ message: 'Warden/Admin access successful.' });
    }
};

export const markAttendance = async (req, res) => {
    const { roll_no, type } = req.body;
    
    if (!roll_no || !type || !['in', 'out'].includes(type)) {
        return res.status(400).json({ error: 'Student roll_no and type (\'in\' or \'out\') are required.' });
    }

    const today = getTodayDateString();
    const now = getTodayTimeString();

    const { data: existingRecord, error: findError } = await supabase
        .from('attendance')
        .select('*')
        .eq('roll_no', roll_no)
        .eq('date', today)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        return res.status(400).json({ error: findError.message });
    }

    if (existingRecord) {
        const updateField = type === 'in' ? 'in_time' : 'out_time';
        const { data, error } = await supabase
            .from('attendance')
            .update({ [updateField]: now })
            .eq('id', existingRecord.id)
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ message: 'Attendance updated successfully', record: data[0] });
    } else {
        if (type === 'out') {
            return res.status(400).json({ error: 'Cannot mark Out time without an In time.' });
        }
        const { data, error } = await supabase
            .from('attendance')
            .insert({ roll_no, date: today, in_time: now })
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ message: 'Attendance marked successfully', record: data[0] });
    }
};