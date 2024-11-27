import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';

const InputStream = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    // sessions: '',
    status: '',
    last_updated: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {  // Make this function async
    e.preventDefault();
    try {
      const stream={
        name:formData.name,
        type:formData.type,
        status:formData.status,
        lastUpdated:formData.last_updated
      }
      const response = await axios.post('http://localhost:8000/api/stream/add-a-stream', stream);
      if (response.status === 200) {
        window.alert("Successfully created");

        // Reset form after success
        setFormData({
          name: '',
          type: '',
          // sessions: '',
          status: '',
          last_updated: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching stream stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add New Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter stream name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Enter stream type"
                className="w-full"
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="sessions">Sessions</Label>
              <Input
                id="sessions"
                name="sessions"
                type="number"
                value={formData.sessions}
                onChange={handleChange}
                placeholder="Enter number of sessions"
                className="w-full"
                required
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastUpdated">Last Updated</Label>
              <Input
                id="lastUpdated"
                name="last_updated"
                type="date"
                value={formData.last_updated}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Stream
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputStream;
