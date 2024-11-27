import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Book, BookOpen, BookX, Tags, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LibraryManagement = () => {

  const navigate=useNavigate();
  const [stats, setStats] = useState({
    availableBooks: 0,
issuedBooks: 0,
totalBooks: 0,
totalCategories: 0
  });
  
  const [bookData, setBookData] = useState([]);

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books//get-book-stats');
      const {  availableBooks,issuedBooks,totalBooks,totalCategories } = response.data;
      setStats({  availableBooks,issuedBooks,totalBooks,totalCategories });
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch slider data
  const fetchBookData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/get-all-books');
      setBookData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookData();
  }, []);

  const handleNewBook = () => {
    // Handle new book logic
    navigate("/library/inventory/add-new");
  };

  const handleEdit = (id) => {
    // Handle edit logic
    navigate("/library/inventory/edit", { state: { isbn: id } });

  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/books/delete-book/${id}`);
      setBookData((prevData) => prevData.filter(slide => slide.id !== id)); // Update state
      fetchStats(); // Re-fetch stats after delete
      fetchBookData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (id) => {
    // Handle view logic
    navigate("/library/inventory/view", { state: { isbn: id } });

  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-xs font-medium text-purple-600">Total Books</div>
                <div className="text-xl font-bold text-purple-700">{stats.totalBooks}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Available Books</div>
                <div className="text-xl font-bold text-green-700">{stats.availableBooks}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <BookX className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Issued Books</div>
                <div className="text-xl font-bold text-amber-700">{stats.issuedBooks}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <Tags className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Categories</div>
                <div className="text-xl font-bold text-blue-700">{stats.totalCategories}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Book Management</h2>
          <Button onClick={handleNewBook} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Book
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>

        {/* Books Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Author</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">ISBN</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
            {bookData.map((book, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{book.title}</td>
              <td className="p-3">{book.author}</td>
              <td className="p-3">{book.category}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {book.status === 'AVAILABLE' ? 'Available' : 'Issued'}
                </span>
              </td>
              <td className="p-3">{book.isbn}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => handleView(book.isbn)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50"
                    onClick={() => handleEdit(book.isbn)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(book.isbn)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
            <span className="font-medium">{stats.totalBooks}</span> results
          </p>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <Button variant="outline" className="rounded-l-md px-2 py-1">Previous</Button>
            <Button variant="outline" className="bg-purple-50 text-purple-600 px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <Button variant="outline" className="rounded-r-md px-2 py-1">Next</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;