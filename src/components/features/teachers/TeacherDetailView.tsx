'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetTeacherById } from '@/queries/teachers/queries';
import { useUpdateTeacher } from '@/queries/teachers/mutation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Teacher } from '@/lib/utils/types';
const TeacherDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetTeacherById(id as string);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const { mutateAsync: updateTeacher, isPending } = useUpdateTeacher(teacherData?.user.id as string);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const canEdit = user?.user?.role === 'DIRECTOR';

  useEffect(() => {
    if (data?.result?.user) {
      setFormData({
        firstName: data.result.user.firstName,
        lastName: data.result.user.lastName,
        phoneNumber: data.result.user.phoneNumber,
      });
      setTeacherData(data.result);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeacher(formData);
      toast.success('Teacher updated successfully');
    } catch (error) {
      toast.error('Failed to update teacher');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data?.result) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Teacher Details</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            Back
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Teacher not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Teacher Details</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            Back
          </Button>
        </div>

        {/* Details Section */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!canEdit}
                className="mt-1 bg-gray-50"
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
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!canEdit}
                className="mt-1 bg-gray-50"
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
                value={formData.phoneNumber}
                onChange={handleChange}
                readOnly={!canEdit}
                className="mt-1 bg-gray-50"
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
                value={data.result.user.email}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Input
                id="role"
                type="text"
                value={data.result.user.role}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            {/* Teacher ID */}
            <div>
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                Teacher ID
              </Label>
              <Input
                id="id"
                type="text"
                value={data.result.id}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            {/* User ID */}
            <div>
              <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                value={data.result.userId}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            {/* Is Activated */}
            <div>
              <Label htmlFor="isActivated" className="text-sm font-medium text-gray-700">
                Is Activated
              </Label>
              <Input
                id="isActivated"
                type="text"
                value={data.result.isActivated.toString()}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>

          {/* Form Actions */}
          {canEdit && (
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TeacherDetailView;