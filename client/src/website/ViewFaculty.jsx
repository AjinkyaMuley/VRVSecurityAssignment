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

const ViewFaculty = ({isEditPossible, onUpdateSuccess,facultyId=null }) => {
    const location=useLocation();
    if(facultyId===null){
      studentId  = location.state || {};
     }
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    email: '',
    is_hod: 'No',
    status: 'Active',
    specialization: '',
    qualification: '',
    join_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/faculty/get-faculty-detail/${facultyId}`);
        setFormData(response.data);
        // console.log(response.data);
      } catch (err) {
        setError('Failed to fetch faculty details');
      }
    };
    fetchFacultyData();
  }, [facultyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`http://localhost:8000/api/faculty/update-faculty/${facultyId}`, formData);
      if (response.status === 200) {
        setSuccess(true);
        onUpdateSuccess?.(response.data);
        setFormData({
            name: '',
            department: '',
            designation: '',
            email: '',
            is_hod: 'No',
            status: 'Active',
            specialization: '',
            qualification: '',
            join_date: ''
        }
        )
        navigate("/website/faculty");

      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update faculty details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditPossible ? "Edit Faculty" : "View Faculty"}</CardTitle>
        <CardDescription>{isEditPossible ? "Edit faculty details" : "Faculty details"}</CardDescription>
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
            <AlertDescription>Faculty details updated successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter faculty name"
                className="w-full"
                readOnly={!isEditPossible}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditPossible ? (
                  <Select value={formData.department} onValueChange={handleSelectChange('department')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={formData.department} readOnly className="w-full" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                {isEditPossible ? (
                  <Select value={formData.designation} onValueChange={handleSelectChange('designation')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={formData.designation} readOnly className="w-full" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full"
                  readOnly={!isEditPossible}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_hod">HOD Status</Label>
                {isEditPossible ? (
                  <Select value={formData.is_hod} onValueChange={handleSelectChange('is_hod')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select HOD status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={formData.is_hod} readOnly className="w-full" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditPossible ? (
                  <Select value={formData.status} onValueChange={handleSelectChange('status')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={formData.status} readOnly className="w-full" />
                )}
              </div>
            </div>
          </div>

          {/* Additional fields for specialization, qualification, and join_date */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Enter specialization"
              readOnly={!isEditPossible}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Enter qualification"
              readOnly={!isEditPossible}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join_date">Join Date</Label>
            <Input
              id="join_date"
              name="join_date"
              type="date"
              value={formData.join_date}
              onChange={handleChange}
              readOnly={!isEditPossible}
              required
            />
          </div>

          {isEditPossible && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Faculty'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ViewFaculty;
