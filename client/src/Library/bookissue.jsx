import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Calendar, AlertCircle, RotateCcw, Plus, Eye, Edit, Filter, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Badge,
} from "@/components/ui/badge";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookIssueStats = () => {

  const navigate=useNavigate();
  const [bookStats,setBookStats]=useState({
    totalIssues: 0,
    currentMonth: 0,
    overdueBooks: 0,
    returnsToday: 0
  });
  const [bookData,setBookData]=useState([]);

  const fetchBookStats=async()=>{
    try {
      const response=await axios.get('http://localhost:8000/api/bookissues/get-issue-stats');
      const {currentMonthIssues,
        dueToday,
        overdueIssues,
        totalIssues}=response.data;
      setBookStats({totalIssues:totalIssues,
        currentMonth:currentMonthIssues,
        overdueBooks:overdueIssues,
        returnsToday:dueToday});
    } catch (error) {
      console.log(error);
    }
  }

  const fetchBookData=async()=>{
    try {
      const response=await axios.get('http://localhost:8000/api/bookissues/get-all-issues');
      console.log(response);
      setBookData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchBookStats();
    fetchBookData();
  },[]);


  const handleNewIssue = () => {
    // Handle new issue logic
    navigate("/library/bookissue/add");
  };

  const handleEdit = (id) => {
    // Handle edit logic
    navigate("/library/bookissue/edit",{state:{id:id}});
  };

  const handleView = (id) => {
    // Handle view logic
    navigate("/library/bookissue/view",{state:{id:id}});
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-xs font-medium text-purple-600">Total Issues</div>
                <div className="text-xl font-bold text-purple-700">{bookStats.totalIssues}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Current Month</div>
                <div className="text-xl font-bold text-blue-700">{bookStats.currentMonth}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Overdue Books</div>
                <div className="text-xl font-bold text-amber-700">{bookStats.overdueBooks}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Returns Today</div>
                <div className="text-xl font-bold text-green-700">{bookStats.returnsToday}</div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Book Issues Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Book Issues Management</h2>
          <div className="space-x-2">
            <Button variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
              <FileText className="h-4 w-4 mr-2" /> Export Report
            </Button>
            <Button onClick={handleNewIssue} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Issue Book
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by member or book..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>

        {/* Issues Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Issue ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Member</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Book</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Issue Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
            {bookData.map((book, index) => (
  <tr key={index} className="border-t hover:bg-gray-50">
    <td className="p-3 font-medium">{book.issue_id}</td>
    <td className="p-3">
      <div>
        <div className="font-medium">{book.members.full_name}</div>
        <div className="text-sm text-gray-500">{book.member_id}</div>
      </div>
    </td>
    <td className="p-3">
      <div>
        <div className="font-medium">{book.title}</div>
        <div className="text-sm text-gray-500">{book.isbn}</div>
      </div>
    </td>
    <td className="p-3">{new Date(book.issue_date).toLocaleDateString()}</td>
    <td className="p-3">{new Date(book.due_date).toLocaleDateString()}</td>
    <td className="p-3">
      <Badge className={` 
        ${book.status === 'RETURNED' ? 'bg-green-100 text-green-700' : ''} 
        ${book.status === 'OVERDUE' ? 'bg-amber-100 text-amber-700' : ''} 
        ${book.status === 'ISSUED' ? 'bg-purple-100 text-purple-700' : ''}
      `}>
        {book.status === 'RETURNED' ? 'Returned' : book.status === 'OVERDUE' ? 'Overdue' : 'Issued'}
      </Badge>
    </td>
    <td className="p-3">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:bg-blue-50"
          onClick={() => handleView(book.issue_id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-amber-600 hover:bg-amber-50"
          onClick={() => handleEdit(book.issue_id)}
        >
          <Edit className="h-4 w-4" />
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
            <span className="font-medium">50</span> results
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

export default BookIssueStats;