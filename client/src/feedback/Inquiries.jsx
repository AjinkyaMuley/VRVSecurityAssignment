import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Tag, 
  Archive, 
  Flag,
  Send,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const ContactFormResponse = () => {
  // Sample data - in real app this would come from props or API
  const submission = {
    id: "CNT-2024001",
    status: "unread",
    createdAt: "2024-03-15 14:30:00",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    department: "Support",
    subject: "Product Installation Help",
    message: "Hello, I'm having trouble installing your software on Windows 11. The installation wizard stops at 75% and shows an error code ERR_456. Could you please help me resolve this issue? I've already tried running as administrator and disabling my antivirus.",
    priority: "medium",
    tags: ["installation", "windows", "error"]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with basic info and actions */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Contact Form Submission #{submission.id}</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700">{submission.department}</Badge>
            <Badge variant="outline" className="text-yellow-600">
              {submission.status}
            </Badge>
            <Badge className="bg-orange-100 text-orange-700">
              {submission.priority}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-600">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Contact Details */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{submission.name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{submission.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{submission.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Submitted On</div>
                  <div className="font-medium">{submission.createdAt}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {submission.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-gray-600">
                    {tag}
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="text-gray-500">
                  <Tag className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Message Content and Response */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Message Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Subject</div>
                  <div className="font-medium">{submission.subject}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Message</div>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {submission.message}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation Help</SelectItem>
                    <SelectItem value="general">General Response</SelectItem>
                    <SelectItem value="followup">Follow-up Questions</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea 
                  placeholder="Type your response here..."
                  className="min-h-[200px]"
                />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Save Draft
                    </Button>
                    <Button variant="outline">
                      Preview
                    </Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Timeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <div className="text-sm font-medium">Submission received</div>
                <div className="text-sm text-gray-500">Mar 15, 2024 14:30:00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 mt-2 rounded-full bg-yellow-500"></div>
              <div>
                <div className="text-sm font-medium">Assigned to Support Department</div>
                <div className="text-sm text-gray-500">Mar 15, 2024 14:30:01</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactFormResponse;