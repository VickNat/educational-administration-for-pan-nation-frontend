'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useCreateGradeLevel } from '@/queries/grade-level/mutations';
import { useGetSubjects } from '@/queries/subjects/queries';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/app/context/AuthContext';
// Validation schema
const gradeLevelSchema = Yup.object().shape({
  level: Yup.string()
    .required('Grade level is required')
    .min(1, 'Grade level must be at least 1 character')
    .max(50, 'Grade level must not exceed 50 characters'),
  subjectList: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one subject must be selected')
    .required('At least one subject must be selected'),
});

interface GradeLevelFormData {
  level: string;
  subjectList: string[];
}

interface Subject {
  id: string;
  name: string;
}

const AddGradeLevel = () => {
  const { mutateAsync: createGradeLevel, isPending } = useCreateGradeLevel();
  const { data: subjectsData } = useGetSubjects();
  const router = useRouter();

  const { user } = useAuth();

  const initialValues: GradeLevelFormData = {
    level: '',
    subjectList: [],
  };

  useEffect(() => {
    if (user?.user.role !== 'DIRECTOR') {
      router.push('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (values: GradeLevelFormData, { resetForm }: any) => {
    try {
      await createGradeLevel(values);
      toast.success('Grade level added successfully');
      resetForm();
      router.back();
    } catch (error) {
      toast.error(`Failed to add grade level: ${error}`);
      console.error('Error adding grade level:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Grade Level</h1>
          <p className="text-sm text-muted-foreground">Grade Level / Add Grade Level</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={gradeLevelSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                    Grade Level
                  </Label>
                  <Field
                    as={Input}
                    id="level"
                    name="level"
                    type="text"
                    placeholder="e.g., Grade 1"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="level"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Subjects
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectsData?.result?.map((subject: Subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject.id}`}
                          checked={values.subjectList.includes(subject.id)}
                          onCheckedChange={(checked: boolean) => {
                            const newSubjectList = checked
                              ? [...values.subjectList, subject.id]
                              : values.subjectList.filter((id) => id !== subject.id);
                            setFieldValue('subjectList', newSubjectList);
                          }}
                        />
                        <Label
                          htmlFor={`subject-${subject.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="subjectList"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Grade Level'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddGradeLevel;