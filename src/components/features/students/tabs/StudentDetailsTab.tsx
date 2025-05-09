'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateStudent } from '@/queries/students/mutations';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Student } from '@/lib/utils/types';

interface StudentDetailsTabProps {
  student: Student;
}

const StudentDetailsTab: React.FC<StudentDetailsTabProps> = ({ student }) => {
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent(student.id);
  const [formData, setFormData] = useState({
    firstName: student.user.firstName,
    lastName: student.user.lastName
  });

  const handleSave = async () => {
    try {
      await updateStudent(formData);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student: ${error}`);
    }
  };

  return (
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
            className="mt-1"
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
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={student.user?.email || '-'}
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
            value={student.user?.phoneNumber || '-'}
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
            value={student.user?.role || '-'}
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
            value={student.id || '-'}
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
            value={student.parentId || '-'}
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
            value={student.sectionId || 'N/A'}
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
            value={student.userId || '-'}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>
      </div>

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
    </div>
  );
};

export default StudentDetailsTab; 