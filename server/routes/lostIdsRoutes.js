const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * Upload a new lost ID (Admin Only)
 */
router.post('/upload', async (req, res) => {
    try {
        const { id_number, owner_name, category_id, status, date_found, location_found, contact_info, comments } = req.body;

        if (!id_number || !owner_name || !category_id || !status || !date_found || !location_found || !contact_info) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const isValidUUID = (uuid) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
        if (!isValidUUID(category_id)) {
            return res.status(400).json({ error: 'Invalid category_id format' });
        }

        const formattedDate = new Date(date_found).toISOString().split('T')[0];

        const { data: lostId, error: insertError } = await supabase
            .from('lost_ids')
            .insert([{ id_number, owner_name, category_id, status, date_found: formattedDate, location_found, contact_info, comments }])
            .select();

        if (insertError) {
            console.error("Supabase Insert Error:", insertError.message);
            return res.status(500).json({ error: insertError.message });
        }

        // Ensure response is returned with 'lostId'
        return res.status(201).json({ message: 'Lost ID uploaded successfully', lostId: lostId[0] });

    } catch (err) {
        console.error('Error uploading lost ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Get all lost IDs (Public)
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('lost_ids').select('*');

        if (error) {
            console.error("Error fetching lost IDs:", error);
            return res.status(500).json({ error: 'Error retrieving lost IDs' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving lost IDs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Get a lost ID by ID Number or Owner Name
 */
router.get('/:query', async (req, res) => {
    try {
        const { query } = req.params;

        const { data, error } = await supabase
            .from('lost_ids')
            .select('*')
            .or(`id_number.eq.${query},owner_name.ilike.%${query}%`);

        if (error || !data.length) {
            console.error("Error fetching lost ID:", error);
            return res.status(404).json({ error: 'Lost ID not found' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving lost ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Search & Filter Lost IDs
 */
router.get('/search', async (req, res) => {
    try {
        const { query, category } = req.query;

        let request = supabase.from('lost_ids').select('*');

        if (query) {
            request = request.or(`id_number.ilike.%${query}%,owner_name.ilike.%${query}%`);
        }

        if (category) {
            request = request.eq('category_id', category);
        }

        const { data, error } = await request;

        if (error) {
            console.error("Error searching lost IDs:", error);
            return res.status(500).json({ error: 'Error searching lost IDs' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error searching lost IDs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Delete a Lost ID (Admin Only)
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from Supabase Database
        const { error } = await supabase.from('lost_ids').delete().eq('id', id);

        if (error) {
            console.error("Error deleting lost ID:", error);
            return res.status(500).json({ error: 'Error deleting lost ID' });
        }

        res.status(200).json({ message: 'Lost ID deleted successfully' });

    } catch (err) {
        console.error('Error deleting lost ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Update Lost ID Details (Admin Only)
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const { error } = await supabase.from('lost_ids').update(updateData).eq('id', id);

        if (error) {
            console.error("Error updating lost ID:", error);
            return res.status(500).json({ error: 'Error updating lost ID' });
        }

        res.status(200).json({ message: 'Lost ID updated successfully' });

    } catch (err) {
        console.error('Error updating lost ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
