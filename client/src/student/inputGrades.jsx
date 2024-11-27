import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Loader2 } from 'lucide-react';

const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const departments = [
  { id: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering' }
];

const GradeEntryForm = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    course_code: '',
    course_name: '',
    professor: '',
    credits: '',
    semester: '',
    semester_year: new Date().getFullYear().toString(),
    grade: '',
    grade_points: '',
    department: '',
    status: 'Completed'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, enrollment_no')
        .order('name');

      if (error) throw error;
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    }
  };

  const calculateGradePoints = (grade) => {
    const gradePoints = {
      'A+': 10,
      'A': 9,
      'B+': 8,
      'B': 7,
      'C': 6,
      'F': 0
    };
    return gradePoints[grade] || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gradeData = {
        course_code: formData.course_code,
        course_name: formData.course_name,
        professor_name: formData.professor,
        credits: parseInt(formData.credits),
        semester: formData.semester,
        semester_year: formData.semester_year,
        department: formData.department,
        grade: formData.grade,
        grade_points: calculateGradePoints(formData.grade),
        status: formData.status
      };

      const { data: gradeInsert, error: gradeError } = await supabase
        .from('student_grades')
        .insert([gradeData])
        .select()
        .single();

      if (gradeError) throw gradeError;

      const mappingData = {
        student_id: formData.student_id,
        grade_id: gradeInsert.id
      };

      const { error: mappingError } = await supabase
        .from('student_grade_mappings')
        .insert([mappingData]);

      if (mappingError) throw mappingError;

      alert('Grade successfully recorded!');

      setFormData({
        student_id: '',
        course_code: '',
        course_name: '',
        professor: '',
        credits: '',
        semester: '',
        semester_year: new Date().getFullYear().toString(),
        grade: '',
        grade_points: '',
        department: '',
        status: 'Completed'
      });
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'grade' ? { grade_points: calculateGradePoints(value) } : {})
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6" />
          <CardTitle className="text-2xl font-bold">Grade Entry</CardTitle>
        </div>
        <CardDescription className="text-blue-100">
          Record course grades for students
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student
              </label>
              <Select
                value={formData.student_id}
                onValueChange={handleSelectChange('student_id')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.enrollment_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <Select
                value={formData.department}
                onValueChange={handleSelectChange('department')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <input
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                placeholder="e.g. CS201"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="e.g. Data Structures"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Professor
              </label>
              <input
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                placeholder="e.g. Prof. Rajesh Kumar"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Credits
              </label>
              <Select
                value={formData.credits}
                onValueChange={handleSelectChange('credits')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select credits" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((credit) => (
                    <SelectItem key={credit} value={credit.toString()}>
                      {credit} {credit === 1 ? 'Credit' : 'Credits'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <Select
                value={formData.semester}
                onValueChange={handleSelectChange('semester')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Grade
              </label>
              <Select
                value={formData.grade}
                onValueChange={handleSelectChange('grade')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>  
                <SelectContent>
                  <SelectItem value="A+">A+ (10)</SelectItem>
                  <SelectItem value="A">A (9)</SelectItem>
                  <SelectItem value="B+">B+ (8)</SelectItem>
                  <SelectItem value="B">B (7)</SelectItem>
                  <SelectItem value="C">C (6)</SelectItem>
                  <SelectItem value="F">F (0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <input
                name="semester_year"
                value={formData.semester_year}
                onChange={handleChange}
                placeholder="e.g. 2024"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                student_id: '',
                course_code: '',
                course_name: '',
                professor: '',
                credits: '',
                semester: '',
                semester_year: new Date().getFullYear().toString(),
                grade: '',
                grade_points: '',
                department: '',
                status: 'Completed'
              })}
              disabled={loading}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Grade'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GradeEntryForm;