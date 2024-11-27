import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, GraduationCap, UserCog, UserCheck, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
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

const MemberManagement = () => {

  const navigate=useNavigate();
  const [memberStats,setMemberStats]=useState({
    totalMembers: 0,
    studentMembers: 0,
    facultyMembers: 0,
    activeMembers: 0
  })

  const [memberData,setMemberData]=useState([]);

  const fetchMemberStats=async()=>{
      try {
        const response=await axios.get("http://localhost:8000/api/members/get-all-member-stats");
        if(response){
          setMemberStats(response.data);
        }
      } catch (error) {
        console.log(error);
      }
  }

  const fetchMemberData=async()=>{
    try {
      const response=await axios.get("http://localhost:8000/api/members/get-all-members");
      if(response){
        // console.log(response.data);
        setMemberData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchMemberStats();
    fetchMemberData();
  },[])

  const handleNewMember = () => {
    // Handle new member logic
    navigate("/library/members/add");
  };

  const handleEdit = (id) => {
    // Handle edit logic
  };

  const handleDelete = async (member_id) => {
    // Handle delete logic
    const response=await axios.delete(`http://localhost:8000/api/members/delete-member/${member_id}`);
    if(response.status===200){
      fetchMemberData();
      fetchMemberStats();
    }
    else{
      alert("error deleteing member !");
    }

  };

  const handleView = (id) => {
    // Handle view logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-indigo-50 to-white">
                <div className="text-xs font-medium text-indigo-600">Total Members</div>
                <div className="text-xl font-bold text-indigo-700">{memberStats.totalMembers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-xs font-medium text-blue-600">Student Members</div>
                <div className="text-xl font-bold text-blue-700">{memberStats.studentMembers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-amber-50 to-white">
                <div className="text-xs font-medium text-amber-600">Faculty Members</div>
                <div className="text-xl font-bold text-amber-700">{memberStats.facultyMembers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 flex-1 bg-gradient-to-br from-green-50 to-white">
                <div className="text-xs font-medium text-green-600">Active Members</div>
                <div className="text-xl font-bold text-green-700">{memberStats.activeMembers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Member Management</h2>
          <Button onClick={handleNewMember} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Member Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Member ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
                {/* <th className="p-3 text-left text-sm font-medium text-gray-500">Books Issued</th> */}
                <th className="p-3 text-left text-sm font-medium text-gray-500">Join Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
            {memberData.map((member, index) => (
  <tr key={index} className="border-t hover:bg-gray-50">
    <td className="p-3 font-medium">{member.member_id}</td>
    <td className="p-3">{member.full_name}</td>
    <td className="p-3">
      <Badge variant="outline" className={member.type === "Faculty" ? "text-amber-600" : "text-blue-600"}>
        {member.type}
      </Badge>
    </td>
    <td className="p-3">
      <Badge className={`
        ${member.status === 'active' ? 'bg-green-100 text-green-700' : ''}
        ${member.status === 'inactive' ? 'bg-yellow-100 text-red-700' : ''}
        ${member.status === 'Suspended' ? 'bg-red-100 text-red-700' : ''}
      `}>
        {member.status || 'inactive'}
      </Badge>
    </td>
    {/* <td className="p-3">{index} / 5</td> */}
    <td className="p-3">{new Date(member.created_at).toLocaleDateString()}</td>
    <td className="p-3">
      <div className="flex space-x-2">
        {/* <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:bg-blue-50"
          onClick={() => handleView(member.member_id)}
        >
          <Eye className="h-4 w-4" /> */}
        {/* </Button> */}
        {/* <Button
          variant="outline"
          size="sm"
          className="text-amber-600 hover:bg-amber-50"
          onClick={() => handleEdit(member.member_id)}
        >
          <Edit className="h-4 w-4" />
        </Button> */}
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={() => handleDelete(member.member_id)}
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
            <span className="font-medium">{memberStats.totalMembers}</span> results
          </p>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <Button variant="outline" className="rounded-l-md px-2 py-1">Previous</Button>
            <Button variant="outline" className="bg-indigo-50 text-indigo-600 px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <Button variant="outline" className="rounded-r-md px-2 py-1">Next</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;