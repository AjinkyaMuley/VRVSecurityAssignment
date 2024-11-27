import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

export const getStreamStats = async (req, res) => {
    try {
        const { data } = await supabase.from('stream_statistics').select();
        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting stream stats', error)
        res.status(400).json(error)
    }
}

export const getAllStreamData = async (req, res) => {
    try {
        const { data } = await supabase.from('streams').select();

        const { data: session_count } = await supabase
            .from('streams')
            .select(`
                id,
                name,
                sessions:sessions(count)
            `)
            .order('id');

        res.status(200).json({ streamData: { data, session_count } });
    } catch (error) {
        console.log('Error getting all stream data', error);
        res.status(400).json(error);
    }
}

export const addNewStream = async (req, res) => {
    try {
        const response = await supabase
            .from('streams')
            .insert([{
                name: req.body.name,
                type: req.body.type,
                status: req.body.status,
                last_updated: req.body.lastUpdated,  
            }])
            .select();

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error adding new stream:', error);
        return res.status(400).json(error);
    }
}

export const updateStream = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed as a URL parameter
        
        const response = await supabase
            .from('streams')
            .update({
                name: req.body.name,
                type: req.body.type,
                status: req.body.status,
                last_updated: req.body.lastUpdated,
            })
            .eq('id', id) // Update where id matches
            .select();

        if (response.error) {
            throw response.error;
        }

        if (response.data.length === 0) {
            return res.status(404).json({ message: 'Stream not found' });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error updating stream:', error);
        return res.status(400).json(error);
    }
}

export const deleteStream = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed as a URL parameter

        const response = await supabase
            .from('streams')
            .delete()
            .eq('id', id) // Delete where id matches
            .select();

        if (response.error) {
            throw response.error;
        }

        if (response.data.length === 0) {
            return res.status(404).json({ message: 'Stream not found' });
        }

        return res.status(200).json({ message: 'Stream deleted successfully' });
    } catch (error) {
        console.log('Error deleting stream:', error);
        return res.status(400).json(error);
    }
}