import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8');

export const getAllFines = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fines')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all fines:', error);
        res.status(500).json({ error: 'An error occurred while fetching the fines.' });
    }
};


export const getFineById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('fines')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Fine not found.' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting fine by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the fine.' });
    }
};


export const createFine = async (req, res) => {
    try {
        const { member_id, member_name, fine_type, amount, status, due_date } = req.body;

        const { data, error } = await supabase
            .from('fines')
            .insert([
                { member_id, member_name, fine_type, amount, status, due_date }
            ])
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.log('Error creating a new fine:', error);
        res.status(500).json({ error: 'An error occurred while creating the fine.' });
    }
};


export const updateFine = async (req, res) => {
    try {
        const { id } = req.params;
        const { member_id, member_name, fine_type, amount, status, due_date } = req.body;

        const { data, error } = await supabase
            .from('fines')
            .update({
                member_id, member_name, fine_type, amount, status, due_date
            })
            .eq('id', id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'Fine not found.' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating a fine:', error);
        res.status(500).json({ error: 'An error occurred while updating the fine.' });
    }
};


export const deleteFine = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('fines')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'Fine not found.' });
        }

        res.status(200).json({ message: 'Fine deleted successfully.' });
    } catch (error) {
        console.log('Error deleting a fine:', error);
        res.status(500).json({ error: 'An error occurred while deleting the fine.' });
    }
};


export const getFineStats = async (req, res) => {
    try {
        const [
            totalFineResponse,
            collectedFineResponse,
            pendingFineResponse,
            thisMonthFineResponse
        ] = await Promise.all([
            supabase.rpc('get_total_fine'),
            supabase.rpc('get_collected_fine'),
            supabase.rpc('get_pending_fine'),
            supabase.rpc('get_this_month_fine')
        ]);

        console.log('totalFineResponse:', totalFineResponse);
        console.log('collectedFineResponse:', collectedFineResponse);
        console.log('pendingFineResponse:', pendingFineResponse);
        console.log('thisMonthFineResponse:', thisMonthFineResponse);

        if (
            totalFineResponse.error ||
            collectedFineResponse.error ||
            pendingFineResponse.error ||
            thisMonthFineResponse.error
        ) {
            return res.status(400).json({ error: 'Error fetching fine statistics.' });
        }

        // Extract the data from the response
        const totalFine = totalFineResponse.data || 0;
        const collectedFine = collectedFineResponse.data|| 0;
        const pendingFine = pendingFineResponse.data || 0;
        const thisMonthFine = thisMonthFineResponse.data || 0;

        const stats = {
            totalFine,
            collectedFine,
            pendingFine,
            thisMonthFine
        };

        res.status(200).json(stats);
    } catch (error) {
        console.log('Error getting fine statistics:', error);
        res.status(500).json({ error: 'An error occurred while fetching the fine statistics.' });
    }
};