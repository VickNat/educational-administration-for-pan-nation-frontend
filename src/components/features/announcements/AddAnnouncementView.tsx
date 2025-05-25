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
import { uploadImage } from '@/utils/helper';

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
      try {
        const { error, url } = await uploadImage(values.image);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          return;
        }
        imageUrl = url;
      } catch (error: any) {
        toast.error('Failed to upload image: ' + error.message);
        return;
      }
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-4 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Post a New Announcement
          </h1>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/announcements')}
            className="text-primary hover:bg-primary/10"
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
              {/* Topic Section */}
              <div>
                <Label htmlFor="topic" className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Topic
                </Label>
                <Field
                  as={Input}
                  id="topic"
                  name="topic"
                  type="text"
                  placeholder="Enter announcement topic"
                  className="mt-2 border-primary/30 focus:border-primary focus:ring-primary"
                />
                <ErrorMessage name="topic" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Description Section */}
              <div>
                <Label htmlFor="description" className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Description
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Write your announcement details here..."
                  className="mt-2 min-h-[120px] border-primary/30 focus:border-primary focus:ring-primary"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Image Upload Section */}
              <div>
                <Label htmlFor="image" className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Image (Optional)
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(e, setFieldValue)}
                    className="border-primary/30 focus:border-primary focus:ring-primary"
                  />
                  {imagePreview && (
                    <div className="flex items-center justify-center w-24 h-24 rounded-lg border-2 border-primary/20 bg-white overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Director Info Section */}
              <div>
                <Label className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Posted by (Director)
                </Label>
                <Input
                  value={user && user.user.firstName && user.user.lastName ? `${user.user.firstName} ${user.user.lastName}` : ''}
                  readOnly
                  className="mt-2 bg-gray-100 dark:bg-gray-800 border-primary/30 focus:border-primary focus:ring-primary max-w-md"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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