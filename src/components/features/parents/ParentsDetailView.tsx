'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGetParentById } from '@/queries/parents/queries';
import { Parent } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RiArrowLeftLine, RiUserAddLine } from 'react-icons/ri';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForgotPassword } from '@/queries/users/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ParentsDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { data } = useGetParentById(id as string);
  const [parentData, setParentData] = useState<Parent>(data?.result);
  const { user } = useAuth();
  const { mutateAsync: resetPassword, isPending } = useForgotPassword();
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    if (data && data?.result) {
      setParentData(data.result);
    }
  }, [data]);

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    try {
      await resetPassword(
        { userId: parentData?.user?.id, newPassword: values.password },
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Details</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </Button>
          {(user?.user?.role === 'DIRECTOR' || user?.user?.role === 'TEACHER') && (
            <Button
              variant="default"
              onClick={() => {
                router.push(`/dashboard/student/add?parentId=${id}`);
              }}
              className="flex items-center gap-2"
            >
              <RiUserAddLine className="w-4 h-4" />
              Add Student
            </Button>
          )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className='shadow-none border-none'>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <div className="text-base">{parentData?.user?.firstName || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <div className="text-base">{parentData?.user?.lastName || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="text-base">{parentData?.user?.email || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <div className="text-base">{parentData?.user?.phoneNumber || '-'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none border-none'>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {parentData?.students?.length > 0 ? (
              <div className="space-y-2">
                {parentData.students.map((student: any) => (
                  <div key={student.id} className="flex cursor-pointer hover:bg-gray-100 items-center justify-between p-3 rounded-lg border" onClick={() => router.push(`/dashboard/student/${student.id}`)}>
                    <span className="font-medium">{student.user.firstName} {student.user.lastName}</span>
                    <Badge variant="secondary">Student</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No students assigned
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Parent Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {parentData?.user?.firstName} {parentData?.user?.lastName}
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
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
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
  )
}

export default ParentsDetailView