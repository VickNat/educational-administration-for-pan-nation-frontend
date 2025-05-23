'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useAddTeacher } from '@/queries/teachers/mutation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const AddTeacherView = () => {
  const { mutateAsync: addTeacher, isPending } = useAddTeacher();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  if (user?.user?.role !== 'DIRECTOR') {
    router.push('/dashboard/teachers');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTeacher(formData);
      toast.success('Teacher added successfully');
      router.back();
    } catch (error) {
      toast.error(`${error}`);
      console.error('Error adding teacher:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Teacher</h1>
          {/* <p className="text-sm text-muted-foreground">Teachers / Add Teacher</p> */}
        </div>
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                className="mt-1"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                className="mt-1"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                className="mt-1"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="mt-1"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              asChild
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isPending}
            >
              <Link href="/dashboard/teachers">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Teacher'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherView;