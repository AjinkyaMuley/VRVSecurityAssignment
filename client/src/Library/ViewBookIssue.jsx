import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
import { BookOpen, User, Calendar, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewBookIssue = ({ isEditPossible }) => {

  const navigate=useNavigate();
    const location=useLocation();
    const {id}=location.state ||{};
  const [formData, setFormData] = useState({
    // issue_id: '',
    member_id: '',
    isbn: '',
    issue_date: '',
    due_date: '',
    status: 'ISSUED'
  });

  useEffect(() => {
    const fetchIssueDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bookissues/get-issue-detail/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching issue details:', error);
      }
    };

    if (id) {
      fetchIssueDetail();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditPossible) {
      try {
        await axios.put(`http://localhost:8000/api/bookissues/edit-book-issue/${id}`, formData);
        alert('Book issue details updated successfully');
        navigate("/library/bookissue");
      } catch (error) {
        console.error('Error updating book issue details:', error);
        alert('Failed to update book issue details');
      }
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

  const handleIssueDateChange = (e) => {
    const issueDate = new Date(e.target.value);
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 14);
    
    setFormData(prev => ({
      ...prev,
      issue_date: e.target.value,
      due_date: dueDate.toISOString().split('T')[0]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-green-600" />
          <CardTitle className="text-2xl font-bold">Issue Book Details</CardTitle>
        </div>
        <CardDescription>
          {isEditPossible ? 'Edit book issue details' : 'View book issue details'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issue ID */}
            <div className="space-y-2">
              <Label htmlFor="issue_id">Issue ID</Label>
              <Input
                id="issue_id"
                name="issue_id"
                value={formData.issue_id}
                onChange={handleChange}
                placeholder="ISS-2024000"
                className="w-full"
                required
                disabled
              />
            </div>

            {/* Member Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Member ID
              </Label>
              <Input
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                placeholder="MEM-2024000"
                className="w-full"
                required
                disabled={!isEditPossible}
              />
            </div>

            {/* Book Section */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="isbn" className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                ISBN
              </Label>
              <Input
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN"
                className="w-full"
                required
                disabled={!isEditPossible}
              />
            </div>

            {/* Dates Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Issue Date
              </Label>
              <Input
                name="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={handleIssueDateChange}
                className="w-full"
                required
                disabled={!isEditPossible}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full"
                disabled
              />
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Status
              </Label>
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
                  <SelectItem value="ISSUED">Issued</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditPossible && (
            <div className="flex justify-end space-x-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                Update Details
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ViewBookIssue;
