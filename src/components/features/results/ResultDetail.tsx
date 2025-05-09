'use client'

import { Result } from '@/lib/utils/types';
import { useCreateResult } from '@/queries/results/mutations';
import { useGetResultById } from '@/queries/results/queries';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Link, Loader2 } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const ResultDetail = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState<Result | null>(null);
  const { data, isLoading } = useGetResultById(resultId as string);
  const { mutateAsync: createResult } = useCreateResult();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setResult(data.result);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!result) {
    return <div className="text-center text-red-600">Result not found.</div>;
  }

  const initialValues = {
    test1: result.test1,
    test2: result.test2,
    mid: result.mid,
    final: result.final,
    assignment: result.assignment,
    quiz: result.quiz,
    teacherId: result.teacherId,
    studentId: result.studentId,
    sectionId: result.sectionId,
    subjectId: result.subjectId,
  };

  const validationSchema = Yup.object({
    test1: Yup.number().min(0).max(10).required('Required'),
    test2: Yup.number().min(0).max(10).required('Required'),
    mid: Yup.number().min(0).max(20).required('Required'),
    final: Yup.number().min(0).max(40).required('Required'),
    assignment: Yup.number().min(0).max(15).required('Required'),
    quiz: Yup.number().min(0).max(5).required('Required'),
  });

  const handleSubmit = async (values: any) => {
    try {
      await createResult({ ...values });
      toast.success('Result updated successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update result.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Result Details</h2>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test1">Test 1 (out of 10)</Label>
                <Field as={Input} name="test1" type="number" min="0" max="10" />
                <ErrorMessage name="test1" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="test2">Test 2 (out of 10)</Label>
                <Field as={Input} name="test2" type="number" min="0" max="10" />
                <ErrorMessage name="test2" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="mid">Mid (out of 20)</Label>
                <Field as={Input} name="mid" type="number" min="0" max="20" />
                <ErrorMessage name="mid" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="final">Final (out of 40)</Label>
                <Field as={Input} name="final" type="number" min="0" max="40" />
                <ErrorMessage name="final" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="assignment">Assignment (out of 15)</Label>
                <Field as={Input} name="assignment" type="number" min="0" max="15" />
                <ErrorMessage name="assignment" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="quiz">Quiz (out of 5)</Label>
                <Field as={Input} name="quiz" type="number" min="0" max="5" />
                <ErrorMessage name="quiz" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input name="teacherId" value={result.teacherId} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input name="studentId" value={result.studentId} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="sectionId">Section ID</Label>
                <Input name="sectionId" value={result.sectionId} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="subjectId">Subject</Label>
                <Input name="subjectId" value={result.subject?.name || result.subjectId} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ResultDetail