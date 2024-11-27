import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

// Add a new member
export const addMember = async (req, res) => {
    try {
        const { full_name, email, phone ,status,type} = req.body;
        
        // Generate member_id with MEM- prefix and random string
        const member_id = `MEM-${Math.random().toString(36).substr(2, 9)}`;
        
        const response = await supabase
            .from('members')
            .insert([{
                member_id,
                full_name,
                email,
                phone,
                status,
                type
            }])
            .select();

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error adding new member:', error);
        return res.status(400).json(error);
    }
}

// Get all members
export const getAllMembers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all members:', error);
        res.status(400).json(error);
    }
}

// Delete member by ID
export const deleteMember = async (req, res) => {
    try {
        const { member_id } = req.params;

        const response = await supabase
            .from('members')
            .delete()
            .eq('member_id', member_id)
            .select();

        if (response.error) throw response.error;

        if (response.data.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        return res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.log('Error deleting member:', error);
        return res.status(400).json(error);
    }
}

// Get member details by ID
export const getMemberDetails = async (req, res) => {
    try {
        const { member_id } = req.params;

        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('member_id', member_id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Member not found' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log('Error getting member details:', error);
        return res.status(400).json(error);
    }
}

// Get member statistics
export const getMemberStats = async (req, res) => {
    try {
        // Get total count of members
        const { count: totalMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true });

        // Get student members count (assuming there's a type column or similar)
        const { count: studentMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Student');

        // Get faculty members count
        const { count: facultyMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'Faculty');

        // Get active members count (assuming there's a status column)
        const { count: activeMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        return res.status(200).json({
            totalMembers,
            studentMembers,
            facultyMembers,
            activeMembers
        });
    } catch (error) {
        console.log('Error getting member statistics:', error);
        return res.status(400).json(error);
    }
}