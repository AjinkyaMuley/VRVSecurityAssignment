import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Building2, UserCheck, UserX, Mail, PenSquare, Trash2, Eye, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyPage = () => {
  const navigate=useNavigate();
  const [facultyStats, setFacultyStats] = useState({
    totalDepartments: 0,
    departments: [],
    totalFaculties: 0,
    activeFaculties: 0,
    disabledFaculties: 0,
  });

  const [facultyData,setFacultyData]=useState([]);

  const fetchFacultyStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/faculty/get-faculty-stats');
      const { totalDepartments, departments, totalFaculties, activeFaculties, disabledFaculties } = response.data;

      setFacultyStats({
        totalDepartments,
        departments,
        totalFaculties,
        activeFaculties, 
        disabledFaculties,
      });
    } catch (error) {
      console.error('Error fetching faculty stats:', error);
    }
  };
  
  const fetchFacultyData=async()=>{
    try{
      const response=await axios.get('http://localhost:8000/api/faculty/get-all-faculty');
      setFacultyData(response.data);
      // console.log(response.data);

    }catch(error){
      console.error('Error fetching faculty data',error);
    }
  }

  useEffect(()=>{
    fetchFacultyStats();
    fetchFacultyData();
  },[])

  const handleNewFaculty = () => {
    // Handle new faculty logic
    navigate("/website/faculty/add-new");

  };

  const handleEdit = (id) => {
    // Handle edit logic
    navigate("/website/faculty/edit-faculty", { state: { facultyId: id } });
  };

  const handleDelete = async(id) => {
    try {
      await axios.delete(`http://localhost:8000/api/faculty/delete-faculty/${id}`);
      setFacultyData(facultyData.filter((stream) => stream.id !== id));
      fetchFacultyStats();
      alert('Faculty deleted successfully');
    } catch (error) {
      console.error('Error deleting stream:', error);
      alert('Failed to delete the stream');
    }
  };

  const handleView = (id) => {
    // Handle view logic
    navigate("/website/faculty/view-faculty", { state: { facultyId: id } });

  };

  const departments = [
    "Computer Science",
    "Electronics",
    "Mathematics",
    "Physics",
    "Mechanical",
    "Chemical",
    "Humanities",
    "Management"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Departments</div>
                <div className="text-xl font-bold text-blue-700">{facultyStats.totalDepartments}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-xs font-medium text-purple-600">Total Faculty</div>
                <div className="text-xl font-bold text-purple-700">{facultyStats.totalFaculties}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Active</div>
                <div className="text-xl font-bold text-green-700">{facultyStats.activeFaculties}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-red-50 to-white">
                <div className="text-xs font-medium text-red-600">Disabled</div>
                <div className="text-xl font-bold text-red-700">{facultyStats.disabledFaculties}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Faculty Management</h2>
          <Button onClick={handleNewFaculty} className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Faculty
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-3">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept.toLowerCase()}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">Reset</Button>
          </div>
        </div>

        {/* Faculty Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Department</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Designation</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">HOD</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyData.map((faculty) => (
                <tr key={faculty.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">{faculty.name}</div>
                      <div className="text-sm text-gray-500">{faculty.qualification}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {faculty.department}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{faculty.designation}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{faculty.email}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {faculty.is_hod && (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      faculty.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {faculty.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(faculty.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 hover:bg-amber-50"
                        onClick={() => handleEdit(faculty.id)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(faculty.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">{facultyStats.totalFaculties}</span> results
          </p>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <Button variant="outline" className="rounded-l-md px-2 py-1">Previous</Button>
            <Button variant="outline" className="bg-blue-50 text-blue-600 px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="rounded-r-md px-2 py-1">Next</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;