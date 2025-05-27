'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateStudent } from '@/queries/students/mutations';
import { toast } from 'react-hot-toast';
import { Loader2, Camera } from 'lucide-react';
import { Student } from '@/lib/utils/types';
import Image from 'next/image';
import logo from '@/../public/images/logo.png'
import { uploadImage } from '@/utils/helper';

interface StudentDetailsTabProps {
  student: Student;
  canEdit: boolean;
}

const StudentDetailsTab: React.FC<StudentDetailsTabProps> = ({ student, canEdit }) => {
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent(student.id);
  const [formData, setFormData] = useState({
    firstName: student.user.firstName,
    lastName: student.user.lastName,
    profile: student.user.profile
  });
  const [imagePreview, setImagePreview] = useState<string | null>(student.user.profile || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsImageLoading(true);
    try {
      let profileUrl = formData.profile;

      if (selectedImage) {
        const { error, url } = await uploadImage(selectedImage);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          setIsImageLoading(false);
          return;
        }
        profileUrl = url;
      }

      await updateStudent({
        ...formData,
        profile: profileUrl,
      });
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student: ${error}`);
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="space-y-8">
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
            {canEdit && (
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
            )}
          </div>
          {canEdit && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Click on the camera icon to change profile picture
            </p>
          )}
        </div>

        {/* Form Fields Section */}
        <div className="w-full md:w-2/3 space-y-6">
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
                disabled={!canEdit}
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
                disabled={!canEdit}
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

            <div>
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender
              </Label>
              <Input
                id="gender"
                type="text"
                value={student.user?.gender === 'M' ? 'Male' : student.user?.gender === 'F' ? 'Female' : '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="text"
                value={student.user?.dateOfBirth ? new Date(student.user.dateOfBirth).toISOString().split('T')[0] : '-'}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isPending || isImageLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {(isPending || isImageLoading) ? (
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

export default StudentDetailsTab; 