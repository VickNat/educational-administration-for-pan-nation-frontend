'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCreateAnnouncement } from '@/queries/announcements/mutations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const AddAnnouncementView = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();
  const { mutateAsync: createAnnouncement } = useCreateAnnouncement();

  // If role is not director go to another page
  useEffect(() => {
    if (user && user.user.role !== 'DIRECTOR') {
      router.push('/dashboard')
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    setFieldValue('image', file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const initialValues = {
    topic: '',
    description: '',
    image: null,
  };

  const validationSchema = Yup.object({
    topic: Yup.string().required('Topic is required'),
    description: Yup.string().required('Description is required'),
    image: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    if (!user) return;
    let imageUrl: string | null = null;
    if (values.image) {
      // In a real app, upload the image and get the URL here
      // For now, just use a preview URL or null
      imageUrl = imagePreview;
    }
    const payload: any = {
      topic: values.topic,
      description: values.description,
      directorId: user.roleId,
    };
    if (imageUrl) payload.image = imageUrl;
    try {
      await createAnnouncement(payload);
      toast.success('Announcement posted successfully!');
      resetForm();
      setImagePreview(null);
      router.push('/dashboard/announcements');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post announcement.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Post a New Announcement</h1>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/announcements')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                    Topic
                  </Label>
                  <Field
                    as={Input}
                    id="topic"
                    name="topic"
                    type="text"
                    placeholder="Enter announcement topic"
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="topic" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Write your announcement details here..."
                    className="min-h-[120px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Image (Optional)
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(e, setFieldValue)}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                {imagePreview && (
                  <div className="flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Posted by (Director)</Label>
                <Input
                  value={user && user.user.firstName && user.user.lastName ? `${user.user.firstName} ${user.user.lastName}` : ''}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 border-blue-300 focus:border-blue-500 focus:ring-blue-500 max-w-md"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Announcement'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddAnnouncementView;