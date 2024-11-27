import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users, Clock, AlertCircle, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
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

// Create a single instance of Supabase client
const supabase = createClient(
  "https://bpzcafaystrwmukblixj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8"
);

const ViewAttERP = ({gid=null}) => {
    const { id: paramId } = useParams(); // Get `id` from URL params

    // Use `paramId` if `id` is `null`
    const id = gid ?? paramId;
  
    if (!id) {
      return <div>No grade ID provided.</div>;
    }
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      let { data, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*').eq('student_id',id);

      if (fetchError) throw fetchError;

      let filteredAttendance = data;
      
      if (searchTerm) {
        filteredAttendance = filteredAttendance.filter(record => 
          record.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedClass) {
        filteredAttendance = filteredAttendance.filter(record => 
          record.class_number === selectedClass
        );
      }
      
      if (selectedSection) {
        filteredAttendance = filteredAttendance.filter(record => 
          record.section === selectedSection
        );
      }
      
      if (selectedStatus) {
        filteredAttendance = filteredAttendance.filter(record => 
          record.status === selectedStatus
        );
      }

      setAttendance(filteredAttendance);

      const today = new Date().toISOString().split('T')[0];
      const todayRecords = data.filter(record => record.attendance_date === today);
      
      setStats({
        totalStudents: new Set(data.map(record => record.student_id)).size,
        presentToday: todayRecords.filter(record => record.status === 'Present').length,
        absentToday: todayRecords.filter(record => record.status === 'Absent').length,
        lateToday: todayRecords.filter(record => record.status === 'Late').length
      });

    } catch (err) {
      setError(err.message);
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [searchTerm, selectedClass, selectedSection, selectedStatus]);

  const handleNewAttendance = () => {
    navigate('../student/inputAttendance');
  };

  const handleEdit = (recordId) => {
    if (!recordId) {
      console.error('Record ID is undefined');
      return;
    }
    navigate(`../student/editAttendance/${recordId}`);
  };

  const handleDelete = async (recordId) => {
    if (!recordId) {
      console.error('Record ID is undefined');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', recordId);

      if (deleteError) throw deleteError;

      fetchAttendance();
    } catch (err) {
      console.error('Error deleting attendance record:', err);
      setError(err.message);
    }
  };

  const handleView = (recordId) => {
    if (!recordId) {
      console.error('Record ID is undefined');
      return;
    }
    navigate(`../student/viewAttendance/${recordId}`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedClass(null);
    setSelectedSection(null);
    setSelectedStatus(null);
  };

  if (loading) {
    return <div className="p-6">Loading attendance records...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading attendance records: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Total Students</div>
                <div className="text-xl font-bold text-blue-700">{stats.totalStudents}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Present Today</div>
                <div className="text-xl font-bold text-green-700">{stats.presentToday}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-red-50 to-white">
                <div className="text-xs font-medium text-red-600">Absent Today</div>
                <div className="text-xl font-bold text-red-700">{stats.absentToday}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Late Today</div>
                <div className="text-xl font-bold text-amber-700">{stats.lateToday}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Attendance Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance Management</h2>
          <div className="space-x-2">
            {/* <Button onClick={handleNewAttendance} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Mark Attendance
            </Button> */}
          </div>
        </div>

        {/* Filters */}
        {/* <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResetFilters}
            >
              <Filter className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div> */}

        {/* Attendance Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Student Info</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Class</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Section</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{record.student_name}</div>
                      <div className="text-sm text-gray-500">{record.student_id}</div>
                    </div>
                  </td>
                  <td className="p-3">{record.class_number}</td>
                  <td className="p-3">{record.section}</td>
                  <td className="p-3">{new Date(record.attendance_date).toLocaleDateString()}</td>
                  <td className="p-3">{record.attendance_time || '-'}</td>
                  <td className="p-3">
                    <Badge className={
                      record.status === 'Present' ? "bg-green-100 text-green-700" :
                      record.status === 'Absent' ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(record.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 hover:bg-amber-50"
                        onClick={() => handleEdit(record.id)}
                      >
                       <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {attendance.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-2">No attendance records found</div>
              <div className="text-sm">Try adjusting your filters or add new attendance records</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAttERP;