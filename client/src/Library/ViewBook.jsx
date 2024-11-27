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
import { AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation, useNavigate } from 'react-router-dom';

const ViewBook = ({ onSuccess, isEditPossible}) => {
    const location=useLocation();
    const {isbn}= location.state || {};
    const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    status: 'Available',
    isbn: ''
  });

  useEffect(() => {
    const fetchBookData = async () => {
      if (isbn) {
        try {
          const response = await axios.get(`http://localhost:8000/api/books/get-book-by-id/${isbn}`);
          console.log(response);
          setFormData({
            title: response.data.title || '',
            author: response.data.author || '',
            category: response.data.category || '',
            status: response.data.status || 'Available',
            isbn: response.data.isbn || ''
          });
        } catch (err) {
          setError('Failed to fetch book data');
        }
      }
    };
    fetchBookData();
  }, [isbn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditPossible) {
        await axios.put(`http://localhost:8000/api/books/edit-book/${isbn}`, formData);
        setSuccess(true);
      onSuccess?.();
      setFormData({
        title: '',
        author: '',
        category: '',
        status: 'Available',
        isbn: ''
      })
      navigate("/library/inventory");
      }
      
    } catch (err) {
      setError('Error submitting the book data');
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

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{isEditPossible ? 'Edit Book' : 'Add New Book'}</CardTitle>
        <CardDescription>
          {isEditPossible ? 'Edit book details in inventory' : 'Enter book details for inventory'}
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
            <AlertDescription>Book {isEditPossible ? 'updated' : 'added'} successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className="w-full"
                required
                disabled={!isEditPossible}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full"
                required
                disabled={!isEditPossible}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
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
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="ISSUED">Issued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-sm font-medium">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                  className="w-full"
                  required
                  disabled={!isEditPossible}
                />
              </div>
            </div>
          </div>

          {isEditPossible && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {isEditPossible ? 'Update Book' : 'Add Book'}
                  </div>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ViewBook;
