import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, IndianRupee, Receipt, AlertCircle, TrendingUp, Plus, Eye, Edit, Trash2, Filter, FileText } from 'lucide-react';
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

const FineManagement = () => {
  
  const navigate=useNavigate();
  const [stats, setStats] = useState({
    totalFine: 0,
    collectedFine: 0,
    pendingFine: 0,
    thisMonthFine: 0
  });
  
  const [fineData, setFineData] = useState([]);

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/fines/get-fine-stats');
      const { totalFine,collectedFine,pendingFine,thisMonthFine} = response.data;
      setStats({ totalFine,collectedFine,pendingFine,thisMonthFine});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch slider data
  const fetchFineData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/fines/get-all-fines');
      setFineData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFineData();
  }, []);

  const handleNewFine = () => {
    // Handle new fine logic
    navigate("/library/fine/add-new");

  };

  const handleEdit = (id) => {
    // Handle edit logic
    navigate("/library/fine/edit", { state: { fineId: id } });

  };

  const handleDelete = async(id) => {
    // Handle delete logic
    try {
      await axios.delete(`http://localhost:8000/api/fines/delete-fine/${id}`);
      setFineData((prevData) => prevData.filter(slide => slide.id !== id)); // Update state
      fetchStats(); 
      fetchFineData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (id) => {
    // Handle view logic
    navigate("/library/fine/view", { state: { fineId: id } });

  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-3 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-rose-50 to-white">
                <div className="text-xs font-medium text-rose-600">Total Fine</div>
                <div className="text-xl font-bold text-rose-700">{formatCurrency(stats.totalFine)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Collected</div>
                <div className="text-xl font-bold text-green-700">{formatCurrency(stats.collectedFine)}</div>
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
                <div className="text-xs font-medium text-amber-600">Pending</div>
                <div className="text-xl font-bold text-amber-700">{formatCurrency(stats.pendingFine)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">This Month</div>
                <div className="text-xl font-bold text-blue-700">{formatCurrency(stats.thisMonthFine)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fine Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Fine Management</h2>
          <div className="space-x-2">
            <Button variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
              <FileText className="h-4 w-4 mr-2" /> Export Report
            </Button>
            <Button onClick={handleNewFine} className="bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Fine
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by member name or ID..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Fine Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="late-return">Late Return</SelectItem>
                <SelectItem value="damage">Book Damage</SelectItem>
                <SelectItem value="lost">Lost Book</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
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

        {/* Fines Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Fine ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Member</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
            {fineData.map((fine, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{fine.id}</td>
              <td className="p-3">
                <div>
                  <div className="font-medium">{fine.member_name}</div>
                  <div className="text-sm text-gray-500">{fine.member_id}</div>
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline" className={
                  fine.type === 'Late Return' ? 'text-blue-600' :
                  fine.type === 'Book Damage' ? 'text-amber-600' :
                  'text-red-600'
                }>
                  {fine.fine_type}
                </Badge>
              </td>
              <td className="p-3 font-medium">{formatCurrency(fine.amount)}</td>
              <td className="p-3">
                <Badge className={`
                  ${fine.status === 'Paid' ? 'bg-green-100 text-green-700' : ''}
                  ${fine.status === 'Partial' ? 'bg-amber-100 text-amber-700' : ''}
                  ${fine.status === 'Pending' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {fine.status}
                </Badge>
              </td>
              <td className="p-3">{fine.due_date}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => handleView(fine.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50"
                    onClick={() => handleEdit(fine.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(fine.id)}
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
            <span className="font-medium">50</span> results
          </p>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <Button variant="outline" className="rounded-l-md px-2 py-1">Previous</Button>
            <Button variant="outline" className="bg-rose-50 text-rose-600 px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <Button variant="outline" className="rounded-r-md px-2 py-1">Next</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FineManagement;