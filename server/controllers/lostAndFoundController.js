import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Report a new lost item
// @route   POST /api/lost-and-found/report
// @access  Private (Student)
export const reportLostItem = async (req, res) => {
    const { itemName, location, dateTime, imageUrl, isAnonymous } = req.body;
    const studentProfile = req.profile; // Attached by the checkRole middleware

    // Validate required fields
    if (!itemName) {
        return res.status(400).json({ error: 'Item name is required.' });
    }

    const newItem = {
        item_id: `ITEM-${uuidv4().slice(0, 8).toUpperCase()}`,
        item_name: itemName,
        last_known_location: location,
        last_seen_datetime: dateTime,
        image_url: imageUrl,
        is_anonymous: isAnonymous,
        reported_by: studentProfile.roll_no,
    };

    const { data, error } = await supabase
        .from('LOST_AND_FOUND')
        .insert(newItem)
        .select()
        .single();

    if (error) {
        console.error('Error reporting lost item:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
};
