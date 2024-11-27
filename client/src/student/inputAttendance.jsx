import React, { useState } from 'react';
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

const supabaseUrl = "https://bpzcafaystrwmukblixj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AttendanceEntryForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    class_number: '',
    section: '',
    attendance_date: new Date().toISOString().split('T')[0],
    attendance_time: new Date().toTimeString().slice(0, 5),
    status: '',
    created_by: 'system'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('attendance_records')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      alert('Attendance successfully recorded!');
      
      // Reset form but keep the current date and time
      setFormData(prev => ({
        ...prev,
        student_id: '',
        student_name: '',
        class_number: '',
        section: '',
        status: ''
      }));
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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-6 h-6" />
          <CardTitle className="text-2xl font-bold">Attendance Entry</CardTitle>
        </div>
        <CardDescription className="text-green-100">
          Record student attendance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="e.g. STU-2024100"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Student Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Class Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Class Number
              </label>
              <Select
                value={formData.class_number}
                onValueChange={handleSelectChange('class_number')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 11, 12].map((classNum) => (
                    <SelectItem key={classNum} value={classNum.toString()}>
                      Class {classNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <Select
                value={formData.section}
                onValueChange={handleSelectChange('section')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C'].map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="attendance_date"
                value={formData.attendance_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
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
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Attendance Status
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
              onClick={() => setFormData(prev => ({
                ...prev,
                student_id: '',
                student_name: '',
                class_number: '',
                section: '',
                status: ''
              }))}
              disabled={loading}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Record Attendance'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceEntryForm;