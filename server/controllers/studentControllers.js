import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8');

// Controller to get all student data
export const getAllStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('id');

        if (error) throw error;

        res.status(200).json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.log('Error fetching students:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Controller to get student statistics
export const getStudentStats = async (req, res) => {
    try {
        // Get total count
        const { count: totalCount, error: totalError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // Get active students count
        const { count: activeCount, error: activeError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Active');

        if (activeError) throw activeError;

        // Get inactive students count
        const { count: inactiveCount, error: inactiveError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Inactive');

        if (inactiveError) throw inactiveError;

        res.status(200).json({
            success: true,
            stats: {
                totalStudents: totalCount,
                activeStudents: activeCount,
                inactiveStudents: inactiveCount
            }
        });
    } catch (error) {
        console.log('Error fetching student statistics:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const createStudent = async (req, res) => {
    try {
        const { name, email, enrollment_no, status, join_date } = req.body;

        // Validate required fields
        if (!name || !email || !enrollment_no || !status || !join_date) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required: name, email, enrollment_no, status, and join_date'
            });
        }

        // Validate status value
        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status must be either "Active" or "Inactive"'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(join_date)) {
            return res.status(400).json({
                success: false,
                error: 'Join date must be in YYYY-MM-DD format'
            });
        }

        const { data, error } = await supabase
            .from('students')
            .insert([
                { 
                    name,
                    email,
                    enrollment_no,
                    status,
                    join_date
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.log('Error creating student:', error);
        
        // Handle unique constraint violations
        if (error.code === '23505') {
            if (error.message.includes('students_email_key')) {
                return res.status(400).json({
                    success: false,
                    error: 'Email address already exists'
                });
            }
            if (error.message.includes('students_enrollment_no_key')) {
                return res.status(400).json({
                    success: false,
                    error: 'Enrollment number already exists'
                });
            }
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Controller to update a student
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, enrollment_no, status, join_date } = req.body;

        // Validate required fields
        if (!name || !email || !enrollment_no || !status || !join_date) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required: name, email, enrollment_no, status, and join_date'
            });
        }

        // Validate status value
        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status must be either "Active" or "Inactive"'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(join_date)) {
            return res.status(400).json({
                success: false,
                error: 'Join date must be in YYYY-MM-DD format'
            });
        }

        const { data, error } = await supabase
            .from('students')
            .update({
                name,
                email,
                enrollment_no,
                status,
                join_date
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.log('Error updating student:', error);
        
        // Handle unique constraint violations
        if (error.code === '23505') {
            if (error.message.includes('students_email_key')) {
                return res.status(400).json({
                    success: false,
                    error: 'Email address already exists'
                });
            }
            if (error.message.includes('students_enrollment_no_key')) {
                return res.status(400).json({
                    success: false,
                    error: 'Enrollment number already exists'
                });
            }
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


// Controller to get a specific student
export const getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.log('Error fetching student:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Controller to delete a student
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.log('Error deleting student:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};