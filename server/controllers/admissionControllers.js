import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')


export const getAllAdmissions = async (req, res) => {
    try {
        const { data } = await supabase.from('applications').select();

        res.status(200).json(data);
    } catch (error) {
        console.log('error getting admission data', error);
        res.send(error)
    }
}

export const addNewAdmissions = async (req, res) => {
    try {
        // Access req.body directly instead of destructuring data
        const response = await supabase.from('applications')
            .insert([{
                name: req.body.name,
                course: req.body.course,
                application_date: req.body.application_date,
                status: req.body.status,
                last_updated: req.body.last_updated
            }])
            .select();

        res.status(200).json(response);

    } catch (error) {
        console.log('error getting admission data', error);
        // Send proper error response
        res.status(500).json({ error: error.message });
    }
}

export const getAdmissionDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const { data } = await supabase.from('applications').select().eq('id', id)

        res.status(201).json(data);
    } catch (error) {
        console.log('error getting admission data', error);
        // Send proper error response
        res.status(500).json({ error: error.message });
    }
}

export const approveAdmission = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await supabase.from('applications').update(
            {
                status: 'Approved',
                last_updated: req.body.last_updated
            }
        )
        .eq('id',id)
        .select()

        res.status(200).json(response);

    } catch (error) {
        console.log('error updating admission data', error);
        // Send proper error response
        res.status(500).json({ error: error.message });
    }
}

export const rejectAdmission = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await supabase.from('applications').update(
            {
                status: 'Rejected',
                last_updated: req.body.last_updated
            }
        )
        .eq('id',id)
        .select()

        res.status(200).json(response);

    } catch (error) {
        console.log('error updating admission data', error);
        // Send proper error response
        res.status(500).json({ error: error.message });
    }
}

export const getAllStats = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('status')
            .then(({ data }) => ({
                data: {
                    total_applications: data.length,
                    pending: data.filter(row => row.status === 'Pending').length,
                    approved: data.filter(row => row.status === 'Approved').length
                }
            }));

        if (error) {
            throw error;
        }

        res.status(200).json(data);
        
    } catch (error) {
        console.log('error getting admission stats:', error);
        res.status(500).json({ error: error.message });
    }
}