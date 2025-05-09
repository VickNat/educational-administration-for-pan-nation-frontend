'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/../public/images/logo.png';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetAnnouncementById } from '@/queries/announcements/queries';
import { Announcement } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { useDeleteAnnouncement } from '@/queries/announcements/mutations';
import { useUpdateAnnouncement } from '@/queries/announcements/mutations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

// Dummy data for the announcement
const announcementData = {
  topic: "Midterm Exam Schedule",
  description: "Please review the attached schedule for midterms. Exams will be held from May 20th to May 25th. Ensure all materials are prepared in advance.",
  image: logo,
  directorId: "director123",
};

const AnnouncementDetailView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const { data, isLoading } = useGetAnnouncementById(id as string);
  const { mutateAsync: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement(id as string);
  const { mutateAsync: deleteAnnouncement, isPending: isDeleting } = useDeleteAnnouncement(id as string);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setAnnouncement(data.result);
      setImagePreview(data.result.image || null);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!announcement) {
    return <div className="text-center text-red-600">Announcement not found.</div>;
  }

  const isDirector = user && user.user?.role === 'DIRECTOR';

  const initialValues = {
    topic: announcement.topic || '',
    description: announcement.description || '',
    image: null,
  };

  const validationSchema = Yup.object({
    topic: Yup.string().required('Topic is required'),
    description: Yup.string().required('Description is required'),
    image: Yup.mixed().nullable(),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    setFieldValue('image', file);
    setImagePreview(file ? URL.createObjectURL(file) : announcement.image || null);
  };

  const handleUpdate = async (values: any) => {
    try {
      let imageUrl = announcement.image || null;
      if (values.image) {
        // In a real app, upload the image and get the URL here
        imageUrl = imagePreview;
      }
      const payload: any = {
        topic: values.topic,
        description: values.description,
        directorId: announcement.directorId,
      };
      if (imageUrl) payload.image = imageUrl;
      await updateAnnouncement(payload);
      toast.success('Announcement updated successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update announcement.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement();
      toast.success('Announcement deleted successfully!');
      router.push('/dashboard/announcements');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete announcement.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Announcement Details</h1>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/announcements')}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        {isDirector ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-8">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Topic</Label>
                  <Field
                    as={Input}
                    name="topic"
                    type="text"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="topic" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <Field
                    as={Input}
                    name="description"
                    type="text"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Image (Optional)</Label>
                  <Input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(e, setFieldValue)}
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {imagePreview && (
                    <div className="flex items-center mt-2">
                      <Image
                        src={imagePreview}
                        alt={values.topic}
                        width={120}
                        height={120}
                        className="object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Posted by</Label>
                  <Input
                    type="text"
                    value={`Director ID: ${announcement.directorId}`}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={isSubmitting || isUpdating}
                  >
                    {isSubmitting || isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this announcement? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-8">
            <div>
              <Label className="text-sm font-medium text-gray-700">Topic</Label>
              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                {announcement?.topic}
              </h2>
            </div>
            {announcement?.image && (
              <div className="relative w-full h-96">
                <Image
                  src={announcement?.image}
                  alt={announcement?.topic}
                  fill
                  className="object-cover rounded-lg"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgJ9d3pG7wAAAABJRU5ErkJggg=="
                />
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {announcement?.description}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Posted by</Label>
              <Input
                type="text"
                value={`Director ID: ${announcement?.directorId}`}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetailView;