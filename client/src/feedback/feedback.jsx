import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ThumbsUp, Plus, Eye, Edit, Filter, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FeedbackStats = () => {
  const stats = {
    totalFeedbacks: 0
  };

  const handleNewFeedback = () => {
    // Handle new feedback logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-teal-50 to-white">
                <div className="text-xs font-medium text-teal-600">Total Feedbacks</div>
                <div className="text-xl font-bold text-teal-700">{stats.totalFeedbacks}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Feedback Management</h2>
          <div className="space-x-2">
            <Button variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
              <FileText className="h-4 w-4 mr-2" /> Export Report
            </Button>
            <Button onClick={handleNewFeedback} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> New Feedback
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
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

        {/* Empty State */}
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <ThumbsUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedbacks Yet</h3>
          <p className="text-gray-500 mb-4">Start collecting valuable feedback from your users</p>
          <Button onClick={handleNewFeedback} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add First Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackStats;