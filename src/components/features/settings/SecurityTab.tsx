import { useChangePassword } from "@/queries/users/mutations";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";

export default function SecurityTab() {
  const { mutateAsync: changePassword } = useChangePassword();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string().required('New password is required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('newPassword')], 'Passwords must match')
              .required('Please confirm your new password'),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              });
              toast.success('Password updated successfully');
              resetForm();
            } catch (error: any) {
              toast.error(error?.message || 'Failed to update password');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <Field
                  name="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <Field
                  name="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
              >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 