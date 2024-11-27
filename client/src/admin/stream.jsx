import React, { useEffect, useState } from 'react'; 
// import { Link } from 'react-router-dom'; 
import { Card, CardContent } from "@/components/ui/card"; // Fixed the typo here
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Play, Users, Radio, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Stream = () => {
  const navigate=useNavigate();
  const [streamStats, setStreamStats] = useState({
    main_streams: 0,
    total_streams: 0,
    total_sessions: 0,
  });

  const [streamData,setStreamData]=useState([]);
  const fetchStreamStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stream/get-stream-stats');
      const [{ main_streams, total_streams, total_sessions }] = response.data;
      setStreamStats({ main_streams, total_streams, total_sessions });
    } catch (error) {
      console.error('Error fetching stream stats:', error);
    }
  };

  const fetchStreamData=async()=>{
    try {
      const response = await axios.get('http://localhost:8000/api/stream/get-all-stream-data');
      setStreamData(response.data.streamData.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching stream stats:', error);
    }
  }
  
  useEffect(()=>{
    fetchStreamData();
    fetchStreamStats();
  },[])

  const handleAddStream = () => {
    // Logic to add stream (e.g., open a modal)
    navigate("/admin/stream/add-stream")
  };

  const handlePlay = (id) => {
    // Logic to play stream
  };

  const handleEdit = (id) => {
    // Logic to edit stream
  };

  const handleDelete = async (id) => {
    try {
      // Send a request to delete the stream
      await axios.delete(`http://localhost:8000/api/stream/delete-stream/${id}`);
      
      setStreamData(streamData.filter((stream) => stream.id !== id));
      fetchStreamStats();
      alert('Stream deleted successfully');
    } catch (error) {
      console.error('Error deleting stream:', error);
      alert('Failed to delete the stream');
    }

  };

  return (
    <div className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-center justify-center">
                <Radio className="h-8 w-8 text-white" />
              </div>
              <div className="p-4 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-sm font-medium text-blue-600">Main Streams</div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold text-blue-700">{streamStats.main_streams}</div>
                  <div className="ml-2 text-xs text-blue-500">Active</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Repeat for Total Streams and Total Sessions */}
      </section>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Streams</h2>
        <Button onClick={handleAddStream} className="bg-blue-600 hover:bg-blue-700 text-white">
          + Add Stream
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-gray-500">No.</th>
              <th className="p-4 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="p-4 text-left text-sm font-medium text-gray-500">Type</th>
              {/* <th className="p-4 text-left text-sm font-medium text-gray-500">Sessions</th> */}
              <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-4 text-left text-sm font-medium text-gray-500">Last Updated</th>
              <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streamData.map(({ id, name, type, status, last_updated }, index) => (
              <tr key={id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                <td className="p-4 text-sm text-gray-600 font-medium">{name}</td>
                <td className="p-4 text-sm text-gray-600">{type}</td>
                {/* <td className="p-4 text-sm text-gray-600">{sessions}</td> */}
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'Active' ? 'bg-green-100 text-green-800' :
                    status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{last_updated}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="p-2 hover:bg-green-50" onClick={() => handlePlay(id)}>
                      <Play className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 hover:bg-blue-50" onClick={() => handleEdit(id)}>
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 hover:bg-red-50" onClick={() => handleDelete(id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stream;