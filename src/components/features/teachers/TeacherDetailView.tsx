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
import { Loader2, Camera } from 'lucide-react';
import { Teacher } from '@/lib/utils/types';
import { useForgotPassword } from '@/queries/users/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { uploadImage } from '@/utils/helper';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const TeacherDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetTeacherById(id as string);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { mutateAsync: resetPassword, isPending: isResetPasswordPending } = useForgotPassword();
  const { mutateAsync: updateTeacher, isPending } = useUpdateTeacher(teacherData?.user.id as string);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const canEdit = user?.user?.role === 'DIRECTOR';

  useEffect(() => {
    if (data?.result?.user) {
      setFormData({
        firstName: data.result.user.firstName,
        lastName: data.result.user.lastName,
        phoneNumber: data.result.user.phoneNumber,
        gender: data.result.user.gender || '',
        dateOfBirth: data.result.user.dateOfBirth ? new Date(data.result.user.dateOfBirth).toISOString().split('T')[0] : '',
      });
      setTeacherData(data.result);
      setImagePreview(data.result.user.profile || null);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImageLoading(true);
    try {
      let profileUrl = teacherData?.user?.profile;

      if (selectedImage) {
        const { error, url } = await uploadImage(selectedImage);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          setIsImageLoading(false);
          return;
        }
        profileUrl = url;
      }

      await updateTeacher({
        ...formData,
        profile: profileUrl,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      });
      toast.success('Teacher updated successfully');
    } catch (error) {
      toast.error('Failed to update teacher');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    if (!teacherData?.user?.id) {
      toast.error('User ID not found');
      return;
    }

    try {
      await resetPassword(
        { userId: teacherData.user.id, newPassword: values.password },
        {
          onSuccess: () => {
            toast.success('Password reset successfully');
            setShowResetPassword(false);
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to reset password');
          },
        }
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
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
          <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            Back
          </Button>
          {user?.user?.role === 'DIRECTOR' && (
            <Button
              variant="default"
              onClick={() => {
                setShowResetPassword(true);
              }}
            >
              Reset Password
            </Button>
          )}
          </div>
        </div>

        {/* Details Section */}
        <form onSubmit={handleSave} className="space-y-8">
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

                {/* Gender */}
            <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender
              </Label>
                  <select
                    id="gender"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!canEdit}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
            </div>

                {/* Date of Birth */}
            <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth
              </Label>
              <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    readOnly={!canEdit}
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>

          {/* Form Actions */}
          {canEdit && (
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                    disabled={isPending || isImageLoading}
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
        </form>
      </div>

      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Teacher Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {teacherData?.user?.firstName} {teacherData?.user?.lastName}
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleResetPassword}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    className={errors.password && touched.password ? 'border-red-500' : ''}
                  />
                  {errors.password && touched.password && (
                    <div className="text-sm text-red-500">{errors.password}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Field
                    as={Input}
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className={errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-sm text-red-500">{errors.confirmPassword}</div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResetPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isResetPasswordPending}>
                    {isResetPasswordPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDetailView;