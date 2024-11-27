import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import inputStudent from './InputStudent';
import InputStudent from './InputStudent';

const StudentsPage = () => {

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
  });

  const [studentData, setStudentData] = useState([]);
  const [isAddStudentFormOpen, setIsAddStudentFormOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/student/get-student-stats');
      const { totalStudents, activeStudents, inactiveStudents } = response.data.stats;
      setStats({ totalStudents, activeStudents, inactiveStudents });


      const studentsResponse = await axios.get('http://localhost:8000/api/student/get-all-students');
      // console.log(studentsResponse.data.data);
      setStudentData(studentsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (id, action) => {
    if (action === 'view') {
      navigate("/admin/student/view-student", { state: { studentId: id } });
    } else if (action === 'edit') {
      navigate("/admin/student/edit-student", { state: { studentId: id } });
    } else if (action === 'delete') {
      // Handle the delete action
      const confirmDelete = window.confirm('Are you sure you want to delete this student?');
      if (confirmDelete) {
        axios.delete(`http://localhost:8000/api/student/delete-student/${id}`)
          .then(response => {
            alert('Student deleted successfully');
            setStudentData(studentData.filter(student => student.id !== id));
            fetchData();
          })
          .catch(error => {
            console.error('Error deleting student:', error);
          });
      }
    }
  };

  const openAddStudentForm = () => {
    setIsAddStudentFormOpen(true);
  };

  const closeAddStudentForm = () => {
    setIsAddStudentFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-sm font-medium text-purple-600">Total Registered</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-purple-700">{stats.totalStudents}</div>
                  <div className="ml-2 text-xs text-purple-500">students</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-sm font-medium text-green-600">Verified Accounts</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-green-700">{stats.activeStudents}</div>
                  <div className="ml-2 text-xs text-green-500">accounts</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-red-50 to-white">
                <div className="text-sm font-medium text-red-600">Unverified Accounts</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-red-700">{stats.inactiveStudents}</div>
                  <div className="ml-2 text-xs text-red-500">accounts</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Students List</h2>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={openAddStudentForm}
          >
            + Add Student
          </Button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Enrollment No.</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Join Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="p-4 text-sm text-gray-600">{student.email}</td>
                  <td className="p-4 text-sm text-gray-600">{student.enrollment_no}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{student.join_date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(student.id, 'view')} variant="outline" size="sm">View</Button>
                      <Button onClick={() => handleAction(student.id, 'edit')} variant="outline" size="sm">Edit</Button>
                      <Button onClick={() => handleAction(student.id, 'delete')} variant="outline" size="sm" className="text-red-500">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

{isAddStudentFormOpen && (
  <InputStudent
    onClose={closeAddStudentForm}
    onStudentAdded={fetchData}
  />
)}

    </div>
  );
};

export default StudentsPage;