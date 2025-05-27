'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGetParentById } from '@/queries/parents/queries';
import { Parent } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RiArrowLeftLine, RiUserAddLine, RiUser3Line, RiTeamLine } from 'react-icons/ri';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForgotPassword } from '@/queries/users/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DetailsTab from './tabs/DetailsTab';
import ChildrenTab from './tabs/ChildrenTab';

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
  const [activeTab, setActiveTab] = useState('details');

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

  const tabs = [
    { id: 'details', label: 'Details', icon: RiUser3Line },
    { id: 'children', label: 'Children', icon: RiTeamLine },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 flex flex-col sm:flex-row items-center gap-6 shadow-none">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Details</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground font-medium">Parent:</span>
              <span className="text-base font-semibold text-gray-800">{parentData?.user?.firstName} {parentData?.user?.lastName}</span>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            className="self-start"
          >
            <span onClick={() => router.back()} className="flex items-center cursor-pointer">
              <RiArrowLeftLine className="w-5 h-5" /> Back
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="bg-white rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6">
            {activeTab === 'details' && <DetailsTab parentData={parentData} user={user} onShowResetPassword={() => setShowResetPassword(true)} />}
            {activeTab === 'children' && <ChildrenTab students={parentData?.students || []} router={router} parentId={parentData?.id} />}
            </div>
            </div>
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