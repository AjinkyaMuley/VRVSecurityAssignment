import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, GraduationCap, Award, Trophy, Plus, Eye, Edit, Trash2, Filter, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Badge,
} from "@/components/ui/badge";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const ViewGradeERP = ({gid=null}) => {
    const { id: paramId } = useParams(); // Get `id` from URL params

    // Use `paramId` if `id` is `null`
    const id = gid ?? paramId;
  
    if (!id) {
      return <div>No grade ID provided.</div>;
    }
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const navigate = useNavigate();

  const stats = {
    currentGPA: 8.7,
    totalCredits: 85,
    completedCourses: 28,
    honorsEligible: true,
  };

  // Fetch combined grades data from all three tables
  const fetchGrades = async () => {
    try {
      setLoading(true);
      let { data: mappings, error: mappingsError } = await supabase
        .from('student_grade_mappings')
        .select(`
          id,
          student_id,
          grade_id,
          students!inner(
            id,
            name,
            email,
            enrollment_no,
            status
          )
        `).eq('student_id',id);

      if (mappingsError) throw mappingsError;

      // Fetch all grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('student_grades')
        .select('*');

      if (gradesError) throw gradesError;

      // Combine the data
      const combinedGrades = mappings.map(mapping => {
        const student = mapping.students;
        const grade = gradesData.find(g => g.id === mapping.grade_id);
        
        return {
          id: mapping.id,
          student_id: student.id,
          student_name: student.name,
          student_email: student.email,
          enrollment_no: student.enrollment_no,
          student_status: student.status,
          ...grade
        };
      });

      // Apply filters
      let filteredGrades = combinedGrades;
      
      if (searchTerm) {
        filteredGrades = filteredGrades.filter(grade => 
          grade.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grade.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grade.student_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedSemester) {
        filteredGrades = filteredGrades.filter(grade => 
          grade.semester === selectedSemester
        );
      }
      
      if (selectedDepartment) {
        filteredGrades = filteredGrades.filter(grade => 
          grade.department === selectedDepartment
        );
      }
      
      if (selectedGrade) {
        filteredGrades = filteredGrades.filter(grade => 
          grade.grade === selectedGrade
        );
      }

      setGrades(filteredGrades);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [searchTerm, selectedSemester, selectedDepartment, selectedGrade]);

  const handleNewGrade = () => {
    navigate('../student/inputGrades');
  };

  const handleEdit = (gradeId) => {
    console.log('Edit clicked with gradeId:', gradeId);
    if (!gradeId) {
      console.error('Grade ID is undefined');
      return;
    }
    navigate(`../student/editGrades/${gradeId}`);
  };
  const exportTranscript = (grades) => {
    try {
      // Validate input
      if (!Array.isArray(grades) || grades.length === 0) {
        throw new Error('No grades data available to export');
      }
  
      // Define headers with proper formatting
      const headers = [
        'Student Name',
        'Enrollment No',
        'Email',
        'Course Code',
        'Course Name',
        'Professor',
        'Credits',
        'Semester',
        'Year',
        'Grade',
        'Grade Points',
        'Status'
      ];
  
      // Format data with proper escaping and null handling
      const csvData = grades.map(grade => [
        grade.student_name || '',
        grade.enrollment_no || '',
        grade.student_email || '',
        grade.course_code || '',
        grade.course_name || '',
        grade.professor_name || '',
        grade.credits || '',
        grade.semester || '',
        grade.semester_year || '',
        grade.grade || '',
        grade.grade_points || '',
        grade.status || ''
      ].map(cell => {
        // Handle special characters and formatting
        if (cell === null || cell === undefined) return '';
        const stringCell = String(cell);
        if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n') || stringCell.includes('\r')) {
          return `"${stringCell.replace(/"/g, '""')}"`;
        }
        return stringCell;
      }));
  
      // Add headers to the data
      csvData.unshift(headers);
  
      // Create CSV string with proper line endings
      const csvString = csvData.map(row => row.join(',')).join('\r\n');
  
      // Create blob with UTF-8 BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvString], { 
        type: 'text/csv;charset=utf-8;' 
      });
  
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `transcript_${timestamp}.csv`;
  
      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
      return true;
    } catch (error) {
      console.error('Error exporting transcript:', error);
      throw error;
    }
  };
  
  // Replace your existing exportToCSV function with:
  const handleExportTranscript = () => {
    try {
      exportTranscript(grades);
    } catch (error) {
      // Show error to user
      alert('Failed to export transcript. Please try again.');
    }
  };

  const handleDelete = async (gradeId) => {
    console.log('Delete clicked with gradeId:', gradeId);
    if (!gradeId) {
      console.error('Grade ID is undefined');
      return;
    }

    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete this grade?')) {
      return;
    }

    try {
      // First delete the mapping
      const { error: mappingError } = await supabase
        .from('student_grade_mappings')
        .delete()
        .eq('grade_id', gradeId);

      if (mappingError) throw mappingError;

      // Then delete the grade
      const { error: gradeError } = await supabase
        .from('student_grades')
        .delete()
        .eq('id', gradeId);

      if (gradeError) throw gradeError;

      // Refresh the grades list after successful deletion
      fetchGrades();
    } catch (err) {
      console.error('Error deleting grade:', err);
      setError(err.message);
    }
  };

  const handleView = (gradeId) => {
    console.log('View clicked with gradeId:', gradeId);
    if (!gradeId) {
      console.error('Grade ID is undefined');
      return;
    }
    navigate(`../student/viewGrades/${gradeId}`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSemester('');
    setSelectedDepartment('');
    setSelectedGrade('');
  };

  if (loading) {
    return <div className="p-6">Loading grades...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading grades: {error}</div>;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Current GPA</div>
                <div className="text-xl font-bold text-blue-700">{stats.currentGPA}/10</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Honors Status</div>
                <div className="text-xl font-bold text-amber-700">
                  {stats.honorsEligible ? "Eligible" : "Not Eligible"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Grade Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Grade Management</h2>
          <div className="space-x-2">
          <Button 
  variant="outline" 
  className="bg-green-50 text-green-600 hover:bg-green-100"
  onClick={handleExportTranscript}
>
  <FileText className="h-4 w-4 mr-2" /> Export Transcript
</Button>
            {/* <Button onClick={handleNewGrade} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Grade
            </Button> */}
          </div>
        </div>

        {/* Filters */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Student Info</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Course Code</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Course Details</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Credits</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Semester</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Grade</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                {/* <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{grade.student_name}</div>
                      <div className="text-sm text-gray-500">{grade.enrollment_no}</div>
                      <div className="text-xs text-gray-400">{grade.student_email}</div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{grade.course_code}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{grade.course_name}</div>
                      <div className="text-sm text-gray-500">{grade.professor_name}</div>
                    </div>
                  </td>
                  <td className="p-3">{grade.credits}</td>
                  <td className="p-3">{`${grade.semester} - ${grade.semester_year}`}</td>
                  <td className="p-3">
                    <Badge className={
                      grade.grade === 'A+' ? "bg-green-100 text-green-700" :
                      grade.grade === 'A' ? "bg-blue-100 text-blue-700" :
                      grade.grade === 'B+' ? "bg-amber-100 text-amber-700" :
                      "bg-purple-100 text-purple-700"
                    }>
                      {grade.grade} ({grade.grade_points})
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={
                      grade.status === 'Completed' ? "bg-green-100 text-green-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {grade.status}
                    </Badge>
                  </td>
                  {/* <td className="p-3"> */}
                    {/* <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(grade.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 hover:bg-amber-50"
                        onClick={() => handleEdit(grade.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(grade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    {/* </div> */}
                  {/* </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          {/* <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{grades.length}</span> of{' '}
            <span className="font-medium">{grades.length}</span> results
          </p> */}
          {/* <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <Button variant="outline" className="rounded-l-md px-2 py-1">Previous</Button>
            <Button variant="outline" className="bg-blue-50 text-blue-600 px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <Button variant="outline" className="rounded-r-md px-2 py-1">Next</Button>
          </nav> */}
        </div>
      </div>
    </div>
  );
};

export default ViewGradeERP;