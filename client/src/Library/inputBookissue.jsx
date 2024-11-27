import React, { useState } from 'react';
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

const BookIssueForm = () => {
  const [formData, setFormData] = useState({
    // issue_id: '',
    member_id: '',
    isbn: '',
    issue_date: '',
    due_date: '',
    // status: 'ISSUED',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post('http://localhost:8000/api/bookissues/add-new-issue', formData);
      console.log('Form submitted:', response.data);
      
      // Reset form data
      setFormData({
        issue_id: '',
        member_id: '',
        isbn: '',
        issue_date: '',
        due_date: '',
        status: 'ISSUED'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <CardTitle className="text-2xl font-bold">Issue New Book</CardTitle>
        </div>
        <CardDescription>
          Record new book issue for library member
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="space-y-2">
              <Label htmlFor="issue_id">Issue ID</Label>
              <Input
                id="issue_id"
                name="issue_id"
                value={formData.issue_id}
                onChange={handleChange}
                placeholder="ISS-2024000"
                className="w-full"
                required
              />
            </div> */}

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
                placeholder="Member ID"
                className="w-full"
                required
              />
            </div>

            {/* Book Section */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Book ISBN
              </Label>
              <Input
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN"
                className="w-full"
                required
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
            {/* <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange('status')}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSUED">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Issued
                    </span>
                  </SelectItem>
                  <SelectItem value="RETURNED">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                      Returned
                    </span>
                  </SelectItem>
                  <SelectItem value="OVERDUE">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      Overdue
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                // issue_id: '',
                member_id: '',
                isbn: '',
                issue_date: '',
                due_date: '',
                // status: 'ISSUED'
              })}
            >
              Clear
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Issue Book
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookIssueForm;
