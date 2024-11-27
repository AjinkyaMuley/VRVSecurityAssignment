import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Receipt } from 'lucide-react';

const FineForm = () => {
  const [formData, setFormData] = useState({
    memberName: '',
    memberId: '',
    fineType: '',
    amount: '',
    status: '',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sentData={
        member_id:formData.memberId, member_name:formData.memberName, fine_type:formData.fineType, amount:formData.amount, status:formData.status, due_date:formData.dueDate
      }

      const response = await fetch("http://localhost:8000/api/fines/add-fine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      } else {
        const data = await response.json();
        console.log("Fine created successfully:", data);

        // Clear form after successful submission
        setFormData({
          memberName: '',
          memberId: '',
          fineType: '',
          amount: '',
          status: '',
          dueDate: ''
        });
      }
    } catch (error) {
      console.error("An error occurred while creating the fine:", error);
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
        <div className="flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-2xl font-bold">Record New Fine</CardTitle>
        </div>
        <CardDescription>
          Enter fine details for library member
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            {/* Member Name */}
            <div className="space-y-2">
              <Label htmlFor="memberName">Member Name</Label>
              <Input
                id="memberName"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                placeholder="Enter member name"
                className="w-full"
                required
              />
            </div>

            {/* Member ID */}
            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                placeholder="LIB-2024000"
                className="w-full"
                required
              />
            </div>

            {/* Fine Type */}
            <div className="space-y-2">
              <Label htmlFor="fineType">Fine Type</Label>
              <Select
                value={formData.fineType}
                onValueChange={handleSelectChange('fineType')}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select fine type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="late-return">
                    <span className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                      Late Return
                    </span>
                  </SelectItem>
                  <SelectItem value="damage">
                    <span className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                      Book Damage
                    </span>
                  </SelectItem>
                  <SelectItem value="lost">
                    <span className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                      Lost Book
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fine Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange('status')}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="partial">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                      Partial
                    </span>
                  </SelectItem>
                  <SelectItem value="paid">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Paid
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Fine Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="50"
                value={formData.amount}
                onChange={handleChange}
                className="pl-7"
                placeholder="Enter fine amount"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                memberName: '',
                memberId: '',
                fineType: '',
                amount: '',
                status: '',
                dueDate: ''
              })}
            >
              Clear
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Record Fine
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FineForm;
