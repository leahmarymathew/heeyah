import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Report a new lost item
// @route   POST /api/lost-and-found/report
// @access  Private (Student)
export const reportLostItem = async (req, res) => {
    const { itemName, location, dateTime, imageUrl, isAnonymous } = req.body;
    const studentProfile = req.user; // Fixed: use req.user instead of req.profile

    // Validate required fields
    if (!itemName) {
        return res.status(400).json({ error: 'Item name is required.' });
    }

    if (!studentProfile || !studentProfile.roll_no) {
        return res.status(401).json({ error: 'Student profile not found.' });
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
        .from('lost_and_found')
        .insert(newItem)
        .select()
        .single();

    if (error) {
        console.error('Error reporting lost item:', error);
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
};

// @desc    Simple lost item reporting - no heavy authentication
// @route   POST /api/lost-and-found/simple
// @access  Public (minimal auth)
export const reportLostItemSimple = async (req, res) => {
    const { rollNo, itemName, location, dateTime, imageUrl, isAnonymous, studentName } = req.body;

    // Validate required fields
    if (!rollNo || !itemName) {
        return res.status(400).json({ error: 'Roll number and item name are required.' });
    }

    try {
        // Verify student exists in student table
        const { data: student, error: studentError } = await supabase
            .from('student')
            .select('roll_no, name')
            .eq('roll_no', rollNo)
            .single();

        if (studentError || !student) {
            return res.status(404).json({ error: 'Student not found with this roll number.' });
        }

        const newItem = {
            item_id: `ITEM-${uuidv4().slice(0, 8).toUpperCase()}`,
            item_name: itemName,
            last_known_location: location || 'Not specified',
            last_seen_datetime: dateTime || new Date().toISOString(),
            image_url: imageUrl || null,
            is_anonymous: isAnonymous || false,
            reported_by: rollNo,
        };

        const { data, error } = await supabase
            .from('lost_and_found')
            .insert(newItem)
            .select()
            .single();

        if (error) {
            console.error('Error reporting lost item:', error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            message: 'Lost item reported successfully!',
            item: data,
            student: student.name,
            rollNo: student.roll_no
        });

    } catch (error) {
        console.error("Error creating simple lost item report:", error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};
