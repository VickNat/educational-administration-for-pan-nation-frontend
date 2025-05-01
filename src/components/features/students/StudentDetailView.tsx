'use client'

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetStudentById } from '@/queries/students/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';
import { useUpdateStudent } from '@/queries/students/mutations';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';

const StudentDetailsView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetStudentById(id as string);
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent(id as string);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const canEdit = user?.role === 'TEACHER' || 
                 user?.role === 'DIRECTOR' || 
                 (user?.role === 'PARENT' && user?.id === data?.result?.parentId);

  React.useEffect(() => {
    if (data?.result?.user) {
      setFormData({
        firstName: data.result.user.firstName,
        lastName: data.result.user.lastName
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateStudent(formData);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student: ${error}`);
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
            <h1 className="text-2xl font-bold">Student Details</h1>
            <p className="text-sm text-muted-foreground">Students / Student Details</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Student not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Details</h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back
        </Button>
      </div>
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                readOnly={!canEdit}
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                readOnly={!canEdit}
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={data.result.user?.email || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={data.result.user?.phoneNumber || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Input
                id="role"
                type="text"
                value={data.result.user?.role || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                Student ID
              </Label>
              <Input
                id="id"
                type="text"
                value={data.result.id || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="parentId" className="text-sm font-medium text-gray-700">
                Parent ID
              </Label>
              <Input
                id="parentId"
                type="text"
                value={data.result.parentId || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="sectionId" className="text-sm font-medium text-gray-700">
                Section ID
              </Label>
              <Input
                id="sectionId"
                type="text"
                value={data.result.sectionId || 'N/A'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                value={data.result.userId || '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
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
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsView;