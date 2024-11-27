import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Loader2 } from 'lucide-react';

const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GradeDisplay = ({gid=null}) => {
  const { id: paramId } = useParams(); // Get `id` from URL params

  // Use `paramId` if `id` is `null`
  const id = gid ?? paramId;

  if (!id) {
    return <div>No grade ID provided.</div>;
  }
  const [loading, setLoading] = useState(true);
  const [gradeData, setGradeData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGradeAndStudent = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('No grade ID provided');
        setLoading(false);
        return;
      }

      try {
        // First, fetch the grade data
        const { data: gradeData, error: gradeError } = await supabase
          .from('student_grades')
          .select('*')
          .eq('id', id)
          .single();

        if (gradeError) throw gradeError;

        // Then fetch the student mapping and student info
        const { data: mappingData, error: mappingError } = await supabase
          .from('student_grade_mappings')
          .select(`
            student_id,
            students (
              name,
              enrollment_no
            )
          `)
          .eq('grade_id', id)
          .single();

        if (mappingError) throw mappingError;

        setGradeData(gradeData);
        setStudentData(mappingData.students);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeAndStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading grade information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!gradeData || !studentData) {
    return (
      <div className="p-8 text-center text-gray-600">
        No grade data found for the provided ID.
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg m-8">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6" />
          <CardTitle className="text-2xl font-bold">Grade Details</CardTitle>
        </div>
        <CardDescription className="text-blue-100">
          Details for {studentData.name} ({studentData.enrollment_no})
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.course_code}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.course_name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Professor</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.professor_name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credits</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.credits}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.semester}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Year</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.semester_year}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.grade}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grade Points</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.grade_points}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="w-full p-2 border rounded-md bg-gray-100">{gradeData.status}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeDisplay;