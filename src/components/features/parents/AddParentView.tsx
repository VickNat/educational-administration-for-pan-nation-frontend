'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAddParent } from '@/queries/parents/mutations';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const AddParentView = () => {
  const { mutateAsync: addParent, isPending } = useAddParent();
  const router = useRouter();
  const [formData, setFormData] = useState<ParentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addParent(formData);
      toast.success('Parent added successfully');
      router.back();
    } catch (error) {
      toast.error(`Failed to add parent: ${error}`);
      console.error('Error adding parent:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Parent</h1>
          <p className="text-sm text-muted-foreground">Parents / Add Parent</p>
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
                placeholder="Abe"
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
                placeholder="Chala"
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
                placeholder="abe@gmail.com"
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
                placeholder="09876542"
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
                placeholder="Abebe"
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
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
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
                'Add Parent'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParentView;