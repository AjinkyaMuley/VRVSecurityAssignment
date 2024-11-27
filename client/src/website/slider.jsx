import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ImageIcon, Eye, PenSquare, Trash2, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const SliderPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    unpublished: 0
  });
  
  const [sliderData, setSliderData] = useState([]);

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sliders/sliders-stats');
      const { publishedSliders, totalSliders, unpublishedSliders } = response.data;
      setStats({ total:totalSliders, published:publishedSliders, unpublished :unpublishedSliders});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch slider data
  const fetchSliderData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sliders/get-all-sliders');
      setSliderData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle new slide logic
  const handleNewSlide = () => {
    // Add logic to create a new slide, e.g., show a modal or form
  };

  // Handle edit slide logic
  const handleEdit = (id) => {
    // Add logic to edit slide, e.g., open a modal or redirect to an edit page
  };

  // Handle delete slide logic
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/sliders/delete-slider/${id}`);
      setSliderData((prevData) => prevData.filter(slide => slide.id !== id)); // Update state
      fetchStats(); 
      fetchSliderData();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle view slide logic
  const handleView = (id) => {
    // Add logic to view slide details
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchStats();
    fetchSliderData();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-xs font-medium text-purple-600">Total Slides</div>
                <div className="text-xl font-bold text-purple-700">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Published</div>
                <div className="text-xl font-bold text-green-700">{stats.published}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Unpublished</div>
                <div className="text-xl font-bold text-amber-700">{stats.unpublished}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slider Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Slider Management</h2>
          <Button onClick={handleNewSlide} className="bg-purple-600 hover:bg-purple-700 text-white">
            + New Slide
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search slides..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-3">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">All Locations</option>
              <option value="home">Home Page</option>
              <option value="about">About Us</option>
              <option value="facilities">Facilities</option>
              <option value="events">Events</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">Reset</Button>
          </div>
        </div>

        {/* Slides Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Image</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Location</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Order</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliderData.map((slide) => (
                <tr key={slide.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="w-16 h-12 rounded overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-900">{slide.title}</td>
                  <td className="p-3 text-sm text-gray-600">
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      {slide.location}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{slide.order}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                      slide.status === 'Published' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {slide.status === 'Published' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {slide.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{slide.publish_date}</td>
                  <td className="p-3 text-sm text-gray-600 space-x-2">
                    <Button variant="outline" onClick={() => handleView(slide.id)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" onClick={() => handleEdit(slide.id)}><PenSquare className="h-4 w-4" /></Button>
                    <Button variant="outline" onClick={() => handleDelete(slide.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-600">Page 1 of 5</div>
          <div className="flex space-x-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderPage;
