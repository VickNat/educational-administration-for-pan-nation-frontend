'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useAddStudent } from '@/queries/students/mutations';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Camera } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { uploadImage } from '@/utils/helper';
import logo from '@/../public/images/logo.png'

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  parentId: string;
  profile?: string | null;
}

interface AddStudentsViewProps {
  parentId: string;
  onStudentAdded?: () => void;
}

const AddStudentsView = ({ parentId, onStudentAdded }: AddStudentsViewProps) => {
  const { mutateAsync: addStudent, isPending } = useAddStudent();
  const router = useRouter();
  const parentIdFromUrl = useSearchParams().get('parentId');
  const { user } = useAuth();
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: 'temp'+Math.random()+parentId+'@gmail.com',
    phoneNumber: '',
    password: '',
    parentId: parentIdFromUrl || parentId,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (user?.user.role !== 'DIRECTOR') {
      router.back();
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImageLoading(true);
    try {
      let profileUrl = null;

      if (selectedImage) {
        const { error, url } = await uploadImage(selectedImage);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          setIsImageLoading(false);
          return;
        }
        profileUrl = url;
      }

      await addStudent({
        ...formData,
        profile: profileUrl,
      });
      toast.success('Student added successfully');
      if (onStudentAdded) {
        onStudentAdded();
      } else {
        router.back();
      }
    } catch (error) {
      toast.error(`Failed to add student: ${error}`);
      console.error('Error adding student:', error);
    } finally {
      setIsImageLoading(false);
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
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
          <p className="text-sm text-muted-foreground">Students / Add Student</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src={imagePreview || logo}
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
                {/* <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ddd@gmail.com"
                    className="mt-1"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                {/* Phone Number */}
                {/* <div>
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
                </div> */}

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

                {/* Parent ID */}
                <div>
                  <Label htmlFor="parentId" className="text-sm font-medium text-gray-700">
                    Parent ID
                  </Label>
                  <Input
                    id="parentId"
                    type="text"
                    className="mt-1 bg-muted"
                    value={formData.parentId}
                    disabled
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => router.back()}
                  disabled={isPending || isImageLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isPending || isImageLoading}
                >
                  {(isPending || isImageLoading) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Student'
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

export default AddStudentsView;