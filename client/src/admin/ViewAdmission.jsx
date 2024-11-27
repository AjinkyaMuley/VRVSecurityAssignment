import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewAdmission = () => {
  const [admissionData, setAdmissionData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { admissionId } = location.state || {};

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admissions/get-admission-detail/${admissionId}`);
        setAdmissionData(response.data[0]);
        console.log(response.data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAdmission();
  }, [admissionId]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading admission data: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!admissionData) {
    return <p>Loading admission data...</p>;
  }

  // Determine the color based on the status
  const statusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-500'; // Green for Approved
      case 'Pending':
        return 'text-yellow-500'; // Yellow for Pending
      default:
        return 'text-red-500'; // Red for others
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Admission Details</CardTitle>
        <CardDescription>
          Detailed view of the admission application for {admissionData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {admissionData.name}
          </div>
          <div>
            <strong>Course:</strong> {admissionData.course}
          </div>
          <div>
            <strong>Application Date:</strong> {admissionData.application_date}
          </div>
          <div>
            <strong>Status:</strong> <span className={statusColor(admissionData.status)}> {admissionData.status}</span>
          </div>
          <div>
            <strong>Last Updated:</strong> {admissionData.last_updated}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewAdmission;
