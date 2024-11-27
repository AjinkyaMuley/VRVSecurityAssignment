import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

const InputAdmission = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    application_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Set default values for status and application_date
      const admissionData = {
        ...formData,
        status: "Pending",
        application_date: formData.application_date || new Date().toISOString().split('T')[0],
        last_updated: formData.application_date || new Date().toISOString().split('T')[0],
      };
      const response = await axios.post('http://localhost:8000/api/admissions/add-new-admission', admissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Admission added:', response.data);
      

      // Reset form
      setFormData({ name: '', course: '', application_date: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">New Admission Application</CardTitle>
        <CardDescription>
          Enter applicant details to submit admission application
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
            <AlertDescription>Application submitted successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Applicant Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter applicant's full name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
  <Label htmlFor="course" className="text-sm font-medium">
    Course
  </Label>
  <select
    id="course"
    name="course"
    value={formData.course}
    onChange={handleChange}
    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select a course</option>
    <option value="Computer Science">Computer Science</option>
    <option value="Business Administration">Business Administration</option>
    <option value="Mechanical Engineering">Mechanical Engineering</option>
    <option value="Electrical Engineering">Electrical Engineering</option>
    <option value="Civil Engineering">Civil Engineering</option>
    <option value="Economics">Economics</option>
    <option value="Psychology">Psychology</option>
  </select>
</div>


            <div className="space-y-2">
              <Label htmlFor="application_date" className="text-sm font-medium">
                Application Date
              </Label>
              <Input
                id="application_date"
                name="application_date"
                type="date"
                value={formData.application_date}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </div>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputAdmission;
