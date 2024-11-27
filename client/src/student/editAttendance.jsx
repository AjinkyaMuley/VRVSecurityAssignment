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
import { UserCheck, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EditAttendanceForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    class_number: '',
    section: '',
    attendance_date: '',
    attendance_time: '',
    status: ''
  });

  useEffect(() => {
    fetchAttendanceRecord();
  }, [id]);

  const fetchAttendanceRecord = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        student_id: data.student_id,
        student_name: data.student_name,
        class_number: data.class_number,
        section: data.section,
        attendance_date: data.attendance_date,
        attendance_time: data.attendance_time || '',
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      alert('Failed to fetch attendance record');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('attendance_records')
        .update({
          attendance_time: formData.attendance_time || null,
          status: formData.status,
          updated_at: new Date().toISOString(),
          updated_by: 'system'
        })
        .eq('id', id);

      if (error) throw error;

      alert('Attendance record updated successfully!');
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
      [name]: value
    }));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading attendance record...</span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-6 h-6" />
          <CardTitle className="text-2xl font-bold">Edit Attendance</CardTitle>
        </div>
        <CardDescription className="text-green-100">
          Update attendance record for {formData.student_name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student ID (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                value={formData.student_id}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            {/* Student Name (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                value={formData.student_name}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            {/* Class Number (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                value={formData.class_number}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            {/* Section (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                value={formData.section}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            {/* Date (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                value={formData.attendance_date}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="attendance_time"
                value={formData.attendance_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange('status')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchAttendanceRecord()}
              disabled={loading}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Attendance'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAttendanceForm;