import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewNews = ({ onSuccess, isEditPossible = false}) => {
  const location=useLocation();
  const {newsId}= location.state || {}; 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    department: '',
    priority: '',
    publish_date: '',
    status: '',
  });

  useEffect(() => {
    // if (newsId) {
      fetchNewsData();
    // }
  }, [newsId]);

  const fetchNewsData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news/get-all-news-id/${newsId}`);
      if (response.status === 200) {
        setFormData(response.data);
      }
    } catch (err) {
      setError('Error fetching news data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    const newsData={
        title:formData.title,
        category:formData.category, 
        department:formData.department, 
        priority:formData.priority, 
        content:''  
    }
    try {
      const response = await axios.put(`http://localhost:8000/api/news/update-news/${newsId}`, newsData);
      if (response.status === 200) {
        onSuccess?.(formData);
        setFormData({
            title: '',
            category: '',
            department: '',
            priority: '',
            publish_date: '',
            status: '',
          })

      }
    } catch (err) {
      setError('Error updating news');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{isEditPossible ? "Edit Announcement" : "View Announcement"}</CardTitle>
        <CardDescription>Details of the announcement</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Announcement title"
              readOnly={!isEditPossible}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange('category')}
              disabled={!isEditPossible}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Notice">Notice</SelectItem>
                <SelectItem value="Tender">Tender</SelectItem>
                <SelectItem value="Advertisement">Advertisement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department</Label>
            <Select
              value={formData.department}
              onValueChange={handleSelectChange('department')}
              disabled={!isEditPossible}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academics">Academics</SelectItem>
                <SelectItem value="Training & Placement">Training & Placement</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="publish_date" className="text-sm font-medium">Publish Date</Label>
            <Input
              id="publish_date"
              name="publish_date"
              type="date"
              value={formData.publish_date}
              onChange={handleChange}
              readOnly={!isEditPossible}
              required
            />
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleSelectChange('status')}
              disabled={!isEditPossible}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={handleSelectChange('priority')}
              disabled={!isEditPossible}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditPossible && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewNews;
