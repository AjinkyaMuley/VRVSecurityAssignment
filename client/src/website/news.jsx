import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Bell, FileText, Megaphone, PenSquare, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewsNoticePage = () => {

  const navigate=useNavigate();
  const [newsStats,setNewsStats]=useState({
    total_Advertisements:0 ,total_Notices:0 ,total_Tenders:0
  });
  const [newsData,setNewsData]=useState([]);

  const fetchNewsStats=async()=>{
    try {
      const response=await axios.get('http://localhost:8000/api/news/get-news-stats');
      const {total_Advertisements ,total_Notices ,total_Tenders}=response.data;
      setNewsStats({total_Advertisements ,total_Notices ,total_Tenders});
    } catch (error) {
      console.log(error);
    }
  }

  const fetchNewsData=async()=>{
    try {
      const response=await axios.get('http://localhost:8000/api/news//get-all-news');
      // console.log(response);
      setNewsData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchNewsStats();
    fetchNewsData();
  },[]);

  // const newsData = [
  //   { 
  //     id: 1, 
  //     title: "Admission Open for B.Tech Program 2024-25", 
  //     category: "Notice",
  //     publishDate: "2024-11-01",
  //     status: "Published",
  //     department: "Academics",
  //     priority: "High",
  //     content: "Applications are invited for admission to B.Tech Programs at IIIT Nagpur for the academic year 2024-25. Admission through JEE Mains score."
  //   }
  // ];

  const handleNewArticle = () => {
    // Handle new article logic
    navigate("/website/news/add-new-article");
  };

  const handleEdit = (id) => {
    // Handle edit logic
    navigate("/website/news/edit-news", { state: { newsId: id } });

  };

  const handleDelete = async (id) => {
    // Handle delete logic
    try {
      const response= await axios.delete(`http://localhost:8000/api/news/delete-news/${id}`,{});
      if(response.status===200){
        fetchNewsStats();
        fetchNewsData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    // Handle approve logic
    try {
      const response= await axios.put(`http://localhost:8000/api/news/approve-news/${id}`,{});
      if(response.status===200){
        fetchNewsStats();
        fetchNewsData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (id) => {
    // Handle view logic
    navigate("/website/news/view-news", { state: { newsId: id } });

  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-sm font-medium text-blue-600">Notices</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-blue-700">{newsStats.total_Notices}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-sm font-medium text-amber-600">Tenders</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-amber-700">{newsStats.total_Tenders}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 flex items-center justify-center">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-sm font-medium text-green-600">Advertisements</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-green-700">{newsStats.total_Advertisements}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News/Notice List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">News & Notices Management</h2>
          <div className="space-x-4">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Export List
            </Button>
            <Button onClick={handleNewArticle} className="bg-blue-600 hover:bg-blue-700 text-white">
              + New Article
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="notice">Notice</option>
              <option value="tender">Tender</option>
              <option value="advertisement">Advertisement</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              <option value="academics">Academics</option>
              <option value="administration">Administration</option>
              <option value="research">Research</option>
              <option value="placement">Training & Placement</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Department</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Publish Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Priority</th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsData.map((article) => (
                <tr key={article.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">
                    <div className="max-w-md truncate">{article.title}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.category === 'Notice' ? 'bg-blue-100 text-blue-800' :
                      article.category === 'Tender' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{article.department}</td>
                  <td className="p-4 text-sm text-gray-600">{article.publish_date}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                      article.status === 'Published' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'Published' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.priority === 'High' ? 'bg-red-100 text-red-800' :
                      article.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {article.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(article.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 hover:bg-amber-50"
                        onClick={() => handleEdit(article.id)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      {article.status === 'Pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(article.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(article.id)}
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
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                <span className="font-medium">5</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button variant="outline" className="rounded-l-md">Previous</Button>
                <Button variant="outline" className="bg-blue-50 text-blue-600">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline" className="rounded-r-md">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsNoticePage;