import { createClient } from "@supabase/supabase-js";


const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

// Get all attendance records
export const getAllAttendanceRecords = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance_records')
            .select('*')
            .order('attendance_date', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting attendance records:', error);
        res.status(400).json(error);
    }
};

// Add new attendance record
export const addAttendanceRecord = async (req, res) => {
    try {
        const {
            student_id,
            student_name,
            class_number,
            section,
            attendance_date,
            attendance_time,
            status,
            created_by
        } = req.body;

        const { data, error } = await supabase
            .from('attendance_records')
            .insert([{
                student_id,
                student_name,
                class_number,
                section,
                attendance_date,
                attendance_time,
                status,
                created_by,
                created_at: new Date(),
                updated_at: new Date()
            }])
            .select();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error adding attendance record:', error);
        res.status(400).json(error);
    }
};

// Update attendance record
export const updateAttendanceRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            student_id,
            student_name,
            class_number,
            section,
            attendance_date,
            attendance_time,
            status,
            updated_by
        } = req.body;

        const { data, error } = await supabase
            .from('attendance_records')
            .update({
                student_id,
                student_name,
                class_number,
                section,
                attendance_date,
                attendance_time,
                status,
                updated_by,
                updated_at: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error updating attendance record:', error);
        res.status(400).json(error);
    }
};

// Delete attendance record
export const deleteAttendanceRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('attendance_records')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        console.log('Error deleting attendance record:', error);
        res.status(400).json(error);
    }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
    try {
        // Get total unique dates (total classes)
        const { count: totalClasses, error: countError } = await supabase
            .from('attendance_records')
            .select('attendance_date', { count: 'exact', head: true })
            .order('attendance_date');

        if (countError) throw countError;

        // Get attendance stats per student
        const { data: attendanceData, error: statsError } = await supabase
            .from('attendance_records')
            .select(`
                student_id,
                student_name,
                status
            `);

        if (statsError) throw statsError;

        // Process statistics by student
        const studentStats = attendanceData.reduce((acc, record) => {
            if (!acc[record.student_id]) {
                acc[record.student_id] = {
                    student_id: record.student_id,
                    student_name: record.student_name,
                    totalClasses: totalClasses,
                    attendedClasses: 0,
                    missedClasses: 0,
                    lateClasses: 0,
                    attendanceRate: 0
                };
            }

            switch (record.status) {
                case 'Present':
                    acc[record.student_id].attendedClasses++;
                    break;
                case 'Absent':
                    acc[record.student_id].missedClasses++;
                    break;
                case 'Late':
                    acc[record.student_id].lateClasses++;
                    acc[record.student_id].attendedClasses++; // Count late as attended
                    break;
            }

            // Calculate attendance rate (including late as present)
            acc[record.student_id].attendanceRate = 
                ((acc[record.student_id].attendedClasses / totalClasses) * 100).toFixed(2);

            return acc;
        }, {});

        // Convert to array and sort by student_id
        const statsArray = Object.values(studentStats).sort((a, b) => 
            a.student_id.localeCompare(b.student_id)
        );

        res.status(200).json({
            totalClasses,
            studentStats: statsArray,
            summary: {
                totalStudents: statsArray.length,
                averageAttendanceRate: (
                    statsArray.reduce((sum, student) => sum + parseFloat(student.attendanceRate), 0) / 
                    statsArray.length
                ).toFixed(2)
            }
        });
    } catch (error) {
        console.log('Error getting attendance statistics:', error);
        res.status(400).json(error);
    }
};
