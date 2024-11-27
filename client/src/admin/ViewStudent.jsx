import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation, useNavigate } from 'react-router-dom';

const ViewStudent = ({ isEditPossible, onUpdateSuccess,studentId=null }) => {
  const location = useLocation();
  const navigate=useNavigate();
  if(studentId===null){
   studentId  = location.state || {};
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollment_no: '',
    status: '',
    join_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/student/get-student-by-id/${studentId}`);
        setFormData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          enrollment_no: response.data.data.enrollment_no || '',
          status: response.data.data.status || '',
          join_date: response.data.data.join_date || ''
        });
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch student details');
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditPossible) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Add API call to update student details here
      const response = await axios.put(`http://localhost:8000/api/student/update-student/${studentId}`,formData);
      setFormData({
        name: '',
        email: '',
        enrollment_no: '',
        status: '',
        join_date: ''
      });

      setSuccess(true);
      onUpdateSuccess?.(formData);
      navigate("/admin/student")
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update student details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isEditPossible ? 'Edit Student Details' : 'View Student Details'}
        </CardTitle>
        <CardDescription>
          {isEditPossible ? 'Update student information' : 'Student information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Student details updated successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full"
                required
                readOnly={!isEditPossible}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full"
                required
                readOnly={!isEditPossible}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentNo" className="text-sm font-medium">Enrollment Number</Label>
              <Input
                id="enrollmentNo"
                name="enrollmentNo"
                value={formData.enrollment_no}
                onChange={handleChange}
                placeholder="Enrollment Number"
                className="w-full"
                required
                readOnly={!isEditPossible}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
                required
                disabled={!isEditPossible}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate" className="text-sm font-medium">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.join_date}
                onChange={handleChange}
                className="w-full"
                required
                readOnly={!isEditPossible}
              />
            </div>
          </div>

          {isEditPossible && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ViewStudent;
