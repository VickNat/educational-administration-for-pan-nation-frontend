'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
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

  useEffect(() => {
    if (data) {
      setSubjectsData(data?.result);
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
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section (No Path) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Subjects</h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add subject
          </Button>
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Subjects</h2>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-48 ml-auto"
            />
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade Level ID</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectsData.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{subject.id}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.gradeLevelId}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(subject)}
                        >
                          <RiEdit2Line className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSubject(subject)}
                        >
                          <RiDeleteBinLine className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                      <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                        ID
                      </Label>
                      <Input
                        id="id"
                        type="text"
                        value={editSubject.id}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
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
                    <div>
                      <Label
                        htmlFor="gradeLevelId"
                        className="text-sm font-medium text-gray-700"
                      >
                        Grade Level ID
                      </Label>
                      <Input
                        id="gradeLevelId"
                        type="text"
                        value={editSubject.gradeLevelId || ''}
                        readOnly
                        className="mt-1 bg-gray-50"
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
    </div>
  );
};

export default SubjectsView;