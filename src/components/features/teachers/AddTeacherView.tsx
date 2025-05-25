'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useAddTeacher } from '@/queries/teachers/mutation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { uploadImage } from '@/utils/helper';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (user?.user?.role !== 'DIRECTOR') {
    router.push('/dashboard/teachers');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let profileUrl = null;

      if (selectedImage) {
        const { error, url } = await uploadImage(selectedImage);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          setIsLoading(false);
          return;
        }
        profileUrl = url;
      }

      await addTeacher({
        ...formData,
        profile: profileUrl,
      });
      toast.success('Teacher added successfully');
      router.back();
    } catch (error) {
      toast.error(`${error}`);
      console.error('Error adding teacher:', error);
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src={imagePreview || '/images/logo.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image"
                  />
                  <Label
                    htmlFor="profile-image"
                    className="cursor-pointer p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Click on the camera icon to add a profile picture
              </p>
            </div>

            {/* Form Fields Section */}
            <div className="w-full md:w-2/3 space-y-6">
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
                <div className="md:col-span-2">
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
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Link href="/dashboard/teachers">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Teacher'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherView;