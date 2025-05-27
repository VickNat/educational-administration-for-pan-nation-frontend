'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiEdit2Line, RiDeleteBinLine, RiMore2Line } from 'react-icons/ri';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Subject } from '@/lib/utils/types';
import { useGetSubjects } from '@/queries/subjects/queries';
import { useCreateSubject, useDeleteSubject, useUpdateSubject } from '@/queries/subjects/mutations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Dummy data for subjects
const initialSubjectsData = [
  {
    id: "sub001",
    name: "Mathematics",
    gradeLevelId: "grade001",
  },
  {
    id: "sub002",
    name: "Science",
    gradeLevelId: "grade002",
  },
];

// Validation schemas
const subjectSchema = Yup.object().shape({
  name: Yup.string()
    .required('Subject name is required')
    .min(2, 'Subject name must be at least 2 characters')
    .max(50, 'Subject name must not exceed 50 characters'),
});

const SubjectsView = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const { data, refetch } = useGetSubjects();
  const { mutateAsync: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutateAsync: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const { mutateAsync: deleteSubject, isPending: isDeleting } = useDeleteSubject();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [search, setSearch] = useState('');
  const [popoverOpenId, setPopoverOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setSubjectsData(data?.result);
    }

    if (user?.user.role === 'PARENT') {
      router.push('/dashboard');
    }
  }, [data]);

  const handleAddSubject = async (values: { name: string }, { resetForm }: any) => {
    await createSubject(
      { name: values.name },
      {
        onSuccess: () => {
          toast.success('Subject created successfully');
          resetForm();
          setIsAddDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to create subject');
          console.error('Create subject error:', error);
        },
      }
    );
  };

  const handleEditSubject = async (values: { name: string }, { resetForm }: any) => {
    if (!editSubject) return;

    await updateSubject(
      { id: editSubject.id, name: values.name },
      {
        onSuccess: () => {
          toast.success('Subject updated successfully');
          resetForm();
          setIsEditDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to update subject');
          console.error('Update subject error:', error);
        },
      }
    );
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSubjectToDelete(subject);
    setIsDeleteDialogOpen(true);
    setPopoverOpenId(null);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;

    await deleteSubject(
      subjectToDelete.id,
      {
        onSuccess: () => {
          toast.success('Subject deleted successfully');
          setIsDeleteDialogOpen(false);
          setSubjectToDelete(null);
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to delete subject');
          console.error('Delete subject error:', error);
        },
      }
    );
  };

  const openEditDialog = (subject: Subject) => {
    setEditSubject({ ...subject });
    setIsEditDialogOpen(true);
    setPopoverOpenId(null);
  };

  // Filtered subjects
  const filteredSubjects = subjectsData.filter(subject =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  );

  // Card for each subject
  const SubjectCard = ({ subject }: { subject: Subject }) => {
    const canEditOrDelete = user?.user.role === 'DIRECTOR';
    return (
      <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 flex flex-col justify-center items-center shadow-none hover:border-primary/40 transition-all cursor-pointer min-h-[100px] group">
        {/* 3-dots popover menu */}
        {canEditOrDelete && (
          <Popover open={popoverOpenId === subject.id} onOpenChange={open => setPopoverOpenId(open ? subject.id : null)}>
            <PopoverTrigger asChild>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 focus:outline-none"
                onClick={e => { e.stopPropagation(); setPopoverOpenId(subject.id); }}
              >
                <RiMore2Line className="w-6 h-6 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-2">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/5 text-sm text-gray-800 w-full"
                onClick={e => { e.stopPropagation(); openEditDialog(subject); }}
              >
                <RiEdit2Line className="w-4 h-4" /> Edit
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600 w-full"
                onClick={e => { e.stopPropagation(); handleDeleteSubject(subject); }}
              >
                <RiDeleteBinLine className="w-4 h-4" /> Delete
              </button>
            </PopoverContent>
          </Popover>
        )}
        <div className="text-xl font-bold text-gray-900 text-center w-full truncate">{subject.name}</div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          {user?.user.role === 'DIRECTOR' && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add subject
            </Button>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={subjectSchema}
            onSubmit={handleAddSubject}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter subject name"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || isCreating}
                  >
                    {isCreating ? 'Adding...' : 'Add'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          {editSubject && (
            <Formik
              initialValues={{ name: editSubject.name }}
              validationSchema={subjectSchema}
              onSubmit={handleEditSubject}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter subject name"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting || isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete the subject "{subjectToDelete?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSubjectToDelete(null);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectsView;