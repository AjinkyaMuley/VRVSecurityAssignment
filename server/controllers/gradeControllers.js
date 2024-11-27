import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8');

// Get all student grades
export const getAllGrades = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('student_grades')
            .select('*')
            .order('semester_year', { ascending: false })
            .order('semester', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all grades:', error);
        res.status(400).json(error);
    }
};

// Add new grade entry
export const addGrade = async (req, res) => {
    try {
        const {
            course_code,
            course_name,
            professor_name,
            credits,
            semester,
            semester_year,
            department,
            grade,
            grade_points,
            status
        } = req.body;

        const { data, error } = await supabase
            .from('student_grades')
            .insert([{
                course_code,
                course_name,
                professor_name,
                credits,
                semester,
                semester_year,
                department,
                grade,
                grade_points,
                status: status || 'In Progress'
            }])
            .select();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error adding new grade:', error);
        res.status(400).json(error);
    }
};

// Edit grade entry by ID
export const updateGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const { data, error } = await supabase
            .from('student_grades')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Grade entry not found' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating grade:', error);
        res.status(400).json(error);
    }
};

// Delete grade entry by ID
export const deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('student_grades')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Grade entry not found' });
        }

        res.status(200).json({ message: 'Grade entry deleted successfully' });
    } catch (error) {
        console.log('Error deleting grade:', error);
        res.status(400).json(error);
    }
};

// Get academic statistics
export const getAcademicStats = async (req, res) => {
    try {
        // Get all completed courses
        const { data: grades, error } = await supabase
            .from('student_grades')
            .select('*')
            .eq('status', 'Completed');

        if (error) throw error;

        // Calculate statistics
        let totalCredits = 0;
        let totalGradePoints = 0;
        let completedCourses = 0;
        const honorsMinGPA = 8.5; // Assuming honors eligibility is for GPA >= 8.5

        grades.forEach(grade => {
            totalCredits += grade.credits;
            totalGradePoints += (grade.grade_points * grade.credits);
            completedCourses++;
        });

        const currentGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
        const honorsEligible = currentGPA >= honorsMinGPA;

        const stats = {
            currentGPA: parseFloat(currentGPA),
            totalCredits,
            completedCourses,
            honorsEligible,
            gradeDistribution: grades.reduce((acc, grade) => {
                acc[grade.grade] = (acc[grade.grade] || 0) + 1;
                return acc;
            }, {})
        };

        res.status(200).json(stats);
    } catch (error) {
        console.log('Error calculating academic stats:', error);
        res.status(400).json(error);
    }
};