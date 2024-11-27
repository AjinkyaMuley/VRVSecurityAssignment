import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UserCheck, ArrowUpDown, Search, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const AttendanceView = () => {
  const { id } = useParams();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'attendance_date', direction: 'desc' });

  const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('attendance_date', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedAndFilteredRecords = () => {
    let filtered = [...attendanceRecords];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_id.toString().includes(searchTerm) ||
        record.class_number.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record =>
        record.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  const SortHeader = ({ label, sortKey }) => (
    <th
      className="p-2 text-left cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading attendance records...</span>
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

  return (
    <Card className="w-full shadow-lg m-4">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-6 h-6" />
          <CardTitle>Attendance Records</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by name, ID, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <SortHeader label="Date" sortKey="attendance_date" />
                <SortHeader label="Student ID" sortKey="student_id" />
                <SortHeader label="Name" sortKey="student_name" />
                <SortHeader label="Class" sortKey="class_number" />
                <SortHeader label="Section" sortKey="section" />
                <th className="p-2 text-left">Status</th>
                <SortHeader label="Time" sortKey="attendance_time" />
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredRecords().map((record) => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{new Date(record.attendance_date).toLocaleDateString()}</td>
                  <td className="p-2">{record.student_id}</td>
                  <td className="p-2">{record.student_name}</td>
                  <td className="p-2">{record.class_number}</td>
                  <td className="p-2">{record.section}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-2">{record.attendance_time || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceView;