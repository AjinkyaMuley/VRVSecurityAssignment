import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InputTicker = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    isPublished: true
  });

  const [tickers, setTickers] = useState([
    { id: 1, title: "Slide 1", isPublished: true },
    { id: 2, title: "Slide 2", isPublished: true },
    { id: 3, title: "Slide 3", isPublished: true },
    { id: 4, title: "Slide 4", isPublished: true }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const tickerData = {
        ...formData,
        id: editingId || tickers.length + 1,
        created_at: new Date().toISOString()
      };

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingId) {
        setTickers(prevTickers => 
          prevTickers.map(ticker => 
            ticker.id === editingId ? tickerData : ticker
          )
        );
      } else {
        setTickers(prev => [...prev, tickerData]);
      }

      setSuccess(true);
      onSuccess?.(tickerData);
      
      // Reset form
      setFormData({
        title: '',
        isPublished: true
      });
      setShowForm(false);
      setEditingId(null);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ticker) => {
    setFormData({
      title: ticker.title,
      isPublished: ticker.isPublished
    });
    setEditingId(ticker.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTickers(prev => prev.filter(ticker => ticker.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      title: '',
      isPublished: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Ticker Management</CardTitle>
          <div className="space-x-2">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Add Slide
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Ticker {editingId ? 'updated' : 'created'} successfully!
            </AlertDescription>
          </Alert>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter ticker text"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isPublished" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.isPublished ? "true" : "false"}
                  onValueChange={(value) => 
                    setFormData(prev => ({
                      ...prev,
                      isPublished: value === "true"
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Published
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                        Unpublished
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {editingId ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingId ? 'Update Slide' : 'Create Slide'
                )}
              </Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.id}>
                <TableCell>{ticker.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className={`w-2 h-2 rounded-full mr-2 ${
                        ticker.isPublished ? 'bg-green-500' : 'bg-gray-500'
                      }`} 
                    />
                    {ticker.isPublished ? 'Yes' : 'No'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(ticker)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ticker.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InputTicker;