'use client'

import { Student, Subject, Teacher } from '@/lib/utils/types';
import { useCreateResult } from '@/queries/results/mutations';
import { useGetStudentById } from '@/queries/students/queries';
import { useGetSubjects } from '@/queries/subjects/queries';
import { useGetTeachers } from '@/queries/teachers/queries';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';

const AddResultView = () => {
  const { id: studentId } = useParams();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const teacherId = searchParams.get('teacherId');
  const router = useRouter();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(subjectId);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teacherId);
  const { data, isLoading: isStudentLoading } = useGetStudentById(studentId as string);
  const { data: subjectsData, isLoading: isSubjectLoading } = useGetSubjects();
  const { data: teachersData, isLoading: isTeacherLoading } = useGetTeachers();
  const { mutateAsync: createResult, isPending: isCreatingResult } = useCreateResult();

  // Check if user has permission to access this page
  useEffect(() => {
    if (user?.user?.role === 'DIRECTOR' || user?.user?.role === 'PARENT') {
      toast.error('You do not have permission to access this page');
      router.back();
      return;
    }

    // If subjectId or teacherId is not provided, redirect back
    // if (!subjectId || !teacherId) {
    //   toast.error('Missing required parameters');
    //   router.back();
    //   return;
    // }
  }, [user, router]);

  useEffect(() => {
    if (data) {
      setStudent(data.result);
    }

    if (subjectsData) {
      setSubjects(subjectsData.result);
    }

    if (teachersData) {
      setTeachers(teachersData.result);
    }
  }, [data, subjectsData, teachersData]);

  if(!subjectId) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-red-600 font-semibold">Missing required parameters.</p>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" /> Go back
      </Button>
    </div>
  }

  if (isStudentLoading || isSubjectLoading || isTeacherLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!student) {
    return <div className="text-center text-red-600">Student not found.</div>;
  }

  if (!student.sectionId) {
    return <div className="text-center text-red-600 font-semibold">This student has not been assigned a section. Please assign a section before adding results.</div>;
  }

  const initialValues = {
    test1: '',
    test2: '',
    mid: '',
    final: '',
    assignment: '',
    quiz: '',
    teacherId: selectedTeacherId || '',
    subjectId: selectedSubjectId || '',
    studentId: student.id,
    sectionId: student.sectionId,
  };

  const validationSchema = Yup.object({
    test1: Yup.number().min(0).max(10).required('Required'),
    test2: Yup.number().min(0).max(10).required('Required'),
    mid: Yup.number().min(0).max(20).required('Required'),
    final: Yup.number().min(0).max(40).required('Required'),
    assignment: Yup.number().min(0).max(15).required('Required'),
    quiz: Yup.number().min(0).max(5).required('Required'),
    teacherId: Yup.string().required('Teacher is required'),
    subjectId: Yup.string().required('Subject is required'),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (!selectedTeacherId || !selectedSubjectId) {
        toast.error('Teacher and Subject are required');
        return;
      }

      await createResult({
        ...values,
        teacherId: selectedTeacherId,
        subjectId: selectedSubjectId,
      });
      toast.success('Result added successfully!');
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add result.');
    }
  };

  // Find the selected subject and teacher for display
  const selectedSubject = subjects?.find(s => s.id === selectedSubjectId);
  const selectedTeacher = teachers?.find(t => t.id === selectedTeacherId);

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Result</h2>
        <Button variant="ghost" type="button" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test1">Test 1 (out of 10)</Label>
                <Field as={Input} name="test1" type="number" min="0" max="10" placeholder="Test 1" />
                <ErrorMessage name="test1" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="test2">Test 2 (out of 10)</Label>
                <Field as={Input} name="test2" type="number" min="0" max="10" placeholder="Test 2" />
                <ErrorMessage name="test2" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="mid">Mid (out of 20)</Label>
                <Field as={Input} name="mid" type="number" min="0" max="20" placeholder="Mid" />
                <ErrorMessage name="mid" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="final">Final (out of 40)</Label>
                <Field as={Input} name="final" type="number" min="0" max="40" placeholder="Final" />
                <ErrorMessage name="final" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="assignment">Assignment (out of 15)</Label>
                <Field as={Input} name="assignment" type="number" min="0" max="15" placeholder="Assignment" />
                <ErrorMessage name="assignment" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Label htmlFor="quiz">Quiz (out of 5)</Label>
                <Field as={Input} name="quiz" type="number" min="0" max="5" placeholder="Quiz" />
                <ErrorMessage name="quiz" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <Label htmlFor="teacherId">Teacher</Label>
                <Input 
                  value={selectedTeacher ? `${selectedTeacher.user.firstName} ${selectedTeacher.user.lastName}` : 'Select a teacher'} 
                  readOnly 
                  className="bg-gray-100 dark:bg-gray-800"
                />
                {!selectedTeacherId && (
                  <div className="text-red-500 text-xs mt-1">Teacher is required</div>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="subjectId">Subject</Label>
                <Input 
                  value={selectedSubject ? selectedSubject.name : 'Select a subject'} 
                  readOnly 
                  className="bg-gray-100 dark:bg-gray-800"
                />
                {!selectedSubjectId && (
                  <div className="text-red-500 text-xs mt-1">Subject is required</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input name="studentId" value={student.id} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="sectionId">Section ID</Label>
                <Input name="sectionId" value={student.sectionId || ''} readOnly className="bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isSubmitting || isCreatingResult}
              >
                {isSubmitting || isCreatingResult ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Add Result'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddResultView