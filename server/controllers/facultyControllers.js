import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

// Get all faculties
export const getAllFaculties = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('faculty')
            .select('*')
            .order('name');

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all faculties:', error);
        res.status(400).json(error);
    }
}

// Get faculty by ID
export const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('faculty')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting faculty by ID:', error);
        res.status(400).json(error);
    }
}

// Add new faculty
// Add new faculty
export const addNewFaculty = async (req, res) => {
    try {
        const { 
            name, 
            designation, 
            department, 
            email, 
            is_hod, 
            join_date,
            status,
            specialization,
            qualification 
        } = req.body;

        // Basic validation
        if (!name || !designation || !department || !email || !join_date || !specialization || !qualification) {
            return res.status(400).json({ 
                message: 'Missing required fields. Please provide all required information.' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Invalid email format' 
            });
        }

        const { data, error } = await supabase
            .from('faculty')
            .insert([
                {
                    name,
                    designation,
                    department,
                    email,
                    is_hod: is_hod || false,  // Default to false if not provided
                    join_date,
                    status: status || 'Active',  // Default to 'Active' if not provided
                    specialization,
                    qualification
                }
            ])
            .select();

        if (error) {
            if (error.code === '23505' && error.message.includes('email')) {
                return res.status(400).json({ 
                    message: 'A faculty member with this email already exists.' 
                });
            }
            throw error;
        }

        res.status(201).json({
            message: 'Faculty added successfully',
            faculty: data[0]
        });
    } catch (error) {
        console.log('Error adding new faculty:', error);
        res.status(400).json({
            message: 'Error adding faculty',
            error: error.message
        });
    }
}

// Update faculty
export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            designation, 
            department, 
            email, 
            is_hod, 
            join_date,
            status,
            specialization,
            qualification 
        } = req.body;

        const { data, error } = await supabase
            .from('faculty')
            .update({
                name,
                designation,
                department,
                email,
                is_hod,
                join_date,
                status,
                specialization,
                qualification,
                updated_at: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating faculty:', error);
        res.status(400).json(error);
    }
}

// Delete faculty
export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('faculty')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (error) {
        console.log('Error deleting faculty:', error);
        res.status(400).json(error);
    }
}

// Get faculty statistics
// Get faculty statistics
export const getFacultyStats = async (req, res) => {
    try {
        // Get total departments using query parameter
        const { data: departments } = await supabase
            .from('faculty')
            .select('department', { count: 'exact', head: false })
            .order('department');

        // Get unique departments by filtering in JavaScript
        const uniqueDepartments = [...new Set(departments.map(item => item.department))];

        // Get total faculties
        const { count: totalFaculties } = await supabase
            .from('faculty')
            .select('*', { count: 'exact', head: true });

        // Get active faculties count
        const { count: activeFaculties } = await supabase
            .from('faculty')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Active');

        // Get disabled faculties count
        const { count: disabledFaculties } = await supabase
            .from('faculty')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Disabled');

        res.status(200).json({
            totalDepartments: uniqueDepartments.length,
            departments: uniqueDepartments,
            totalFaculties,
            activeFaculties,
            disabledFaculties
        });
    } catch (error) {
        console.log('Error getting faculty statistics:', error);
        res.status(400).json(error);
    }
}