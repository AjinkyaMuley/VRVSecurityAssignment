import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Lock, LogIn, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createAccountData, setCreateAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [createAccountError, setCreateAccountError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: formData.username,
        password: formData.password
      });

      if (response.status === 200) {
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('id', response.data.userData[0].id);

        if (response.data.role === "students") {
          navigate("/student/erp-student");
        } else if (response.data.role === "faculty") {
          navigate("/faculty/erp-faculty");
        } else {
          navigate('/')
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Login failed';
      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreateAccountError('');

    // Validate inputs
    if (!createAccountData.email) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Email is required"
      });
      return;
    }

    if (createAccountData.password !== createAccountData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match"
      });
      return;
    }

    if (createAccountData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 6 characters long"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/api/auth/create-account', {
        email: createAccountData.email,
        password: createAccountData.password
      });

      if (response.status === 200) {
        // Account creation successful
        toast({
          title: "Account Created",
          description: "Account created successfully! Please log in."
        });
        setShowCreateAccountModal(false);
        // Reset create account form
        setCreateAccountData({
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to create account';
      toast({
        variant: "destructive",
        title: "Account Creation Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Logo and Title Section */}
      <div className="relative text-center mb-8 space-y-4 animate-fade-in">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              ERP
            </span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
          ERP College
        </h1>
        <p className="text-gray-400">Welcome back! Please login to your account.</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-gray-900/50 border border-gray-800 backdrop-blur-xl shadow-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Username</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Remember Me & Create Account */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({...formData, rememberMe: checked})}
                  className="border-gray-600 data-[state=checked]:bg-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me
                </Label>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                className="text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => setShowCreateAccountModal(true)}
              >
                Create Account
              </Button>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Create Account Modal */}
      <Dialog open={showCreateAccountModal} onOpenChange={setShowCreateAccountModal}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your email and set a password to create an account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-email" className="text-gray-200 flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                value={createAccountData.email}
                onChange={(e) => setCreateAccountData({...createAccountData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password" className="text-gray-200 flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Create a password"
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                value={createAccountData.password}
                onChange={(e) => setCreateAccountData({...createAccountData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-200 flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Confirm Password</span>
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                value={createAccountData.confirmPassword}
                onChange={(e) => setCreateAccountData({...createAccountData, confirmPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>
            {createAccountError && (
              <div className="text-red-500 text-sm">
                {createAccountError}
              </div>
            )}
            <DialogFooter>
              <Button 
                type="button"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowCreateAccountModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default LoginPage;