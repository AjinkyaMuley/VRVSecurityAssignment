import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdmissionsPage = () => {

  const navigate=useNavigate();
  const [stats,setStats]=useState(
    {
      total_applications: 0,
      approved: 0,
      pending: 0,
    }
  )
  const [admissionsData, setAdmissionsData] = useState([]);

  useEffect(()=>{
    const fetchAdmissionStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admissions/get-all-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    const fetchAdmissions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admissions/get-all-admissions');
        setAdmissionsData(response.data);
        // console.log(response.data);
      } catch (error) {
        setError('Error fetching admissions data');
        console.error('Error fetching admissions:', error);
      } finally {
      }
    };

    fetchAdmissions();
    fetchAdmissionStats();
  },[])

  const handleNewApplication = () => {
    navigate("/admin/admission/new-application");
  };

  const handleViewDetails = (id) => {
    // Handle view details logic
    navigate("/admin/admission/view-application", { state: { admissionId: id } });
  };

  const handleApprove = async (id, application_name) => {
    try {
        const response1 = await axios.put(`http://localhost:8000/api/admissions/approve-admission/${id}`);
        
        // Update the status of the application in the state
        const updatedAdmissionsData = admissionsData.map(application => 
            application.id === id ? { ...application, status: 'Approved' } : application
        );
        setAdmissionsData(updatedAdmissionsData);
        setStats((prevStats) => ({
            ...prevStats,
            approved: prevStats.approved + 1,
            pending: prevStats.pending - 1,
        }));
        
        // Prepare data for the new student
        const studentData = {
          name: application_name,
          email: `BT${new Date().getFullYear().toString().slice(-2)}${stats.total_applications + 1}@iiitn.ac.in`,
          enrollment_no: `BT${new Date().getFullYear().toString().slice(-2)}${stats.total_applications + 1}`,
          status: 'Active',
          join_date: new Date().toISOString().split('T')[0]
      };
      

        // Separate try block for creating the student
        try {
            const response2 = await axios.post('http://localhost:8000/api/student/add-student', studentData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Student created successfully:', response2.data.data);
            return response2.data.data;
        } catch (error) {
            if (error.response) {
                console.error('Error creating student:', error.response.data.error);
                throw new Error(error.response.data.error || 'Failed to create student');
            } else {
                console.error('Error creating student:', error.message);
                throw error;
            }
        }
    } catch (error) {
        console.error('Error approving application:', error);
    }
};


  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/admissions/reject-admission/${id}`);
      // Update the status of the application in the state
      const updatedAdmissionsData = admissionsData.map(application => 
        application.id === id ? { ...application, status: 'Rejected' } : application
      );
      setAdmissionsData(updatedAdmissionsData);
      setStats((prevStats) => ({
        ...prevStats,
        pending: prevStats.pending - 1,
      }));
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-sm font-medium text-blue-600">Total Applications</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-blue-700">{stats.total_applications}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-sm font-medium text-green-600">Approved</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-red-50 to-white">
                <div className="text-sm font-medium text-red-600">Rejected</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-red-700">{stats.total_applications-stats.approved-stats.pending}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-red-50 to-white">
                <div className="text-sm font-medium text-red-600">Pending</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-red-700">{stats.pending}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Applications List</h2>
          <div className="space-x-4">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Export List
            </Button>
            <Button onClick={handleNewApplication} className="bg-blue-600 hover:bg-blue-700 text-white">
              + New Application
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Courses</option>
              <option value="cs">Computer Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Applicant Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Course</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Application Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Last Updated</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissionsData.map((application) => (
                <tr key={application.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">{application.name}</td>
                  <td className="p-4 text-sm text-gray-600">{application.course}</td>
                  <td className="p-4 text-sm text-gray-600">{application.application_date}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                      application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status === 'Approved' && <CheckCircle className="h-3 w-3" />}
                      {application.status === 'Rejected' && <XCircle className="h-3 w-3" />}
                      {application.status === 'Pending' && <Clock className="h-3 w-3" />}
                      {application.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{application.last_updated}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleViewDetails(application.id)}
                      >
                        View
                      </Button>
                      {application.status === 'Pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(application.id,application.name)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(application.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                <span className="font-medium">4</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button variant="outline" className="rounded-l-md">Previous</Button>
                <Button variant="outline" className="bg-blue-50 text-blue-600">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline" className="rounded-r-md">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsPage;