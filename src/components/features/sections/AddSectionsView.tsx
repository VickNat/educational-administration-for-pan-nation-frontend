'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetGradeLevels } from '@/queries/grade-level/queries';
import { useGetAvailableHomeRoomTeachers } from '@/queries/teachers/queries';
import { useGetStudents, useGetUnassignedStudents } from '@/queries/students/queries';
import { useAddSection } from '@/queries/sections/mutations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { GradeLevel, Student, Teacher } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
// Validation schema
const sectionSchema = Yup.object().shape({
  name: Yup.string()
    .required('Section name is required')
    .min(1, 'Section name must be at least 1 character')
    .max(50, 'Section name must not exceed 50 characters'),
  students: Yup.array()
    .of(Yup.string()),
  gradeLevelId: Yup.string()
    .required('Grade level is required'),
  homeRoom: Yup.string()
    .required('Home room teacher is required'),
});

interface SectionFormData {
  name: string;
  students: string[];
  gradeLevelId: string;
  homeRoom: string;
}

const AddSectionsView = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedGradeLevelId, setSelectedGradeLevelId] = useState<string>('');

  const { data: gradeLevelsData } = useGetGradeLevels();
  const { data: teachersData } = useGetAvailableHomeRoomTeachers();
  // const { data: studentsData } = useGetStudents();
  const { data: unassignedStudentsData } = useGetUnassignedStudents();
  const { mutateAsync: addSection, isPending } = useAddSection();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const gradeLevelIdFromQuery = searchParams.get('gradeLevelId');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.user.role !== 'DIRECTOR') {
      router.push('/dashboard');
    }
  }, [user]);


  useEffect(() => {
    if (gradeLevelsData) {
      setGradeLevels(gradeLevelsData.result);
    }

    if (teachersData) {
      setTeachers(teachersData.result);
    }

    if (unassignedStudentsData) {
      setStudents(unassignedStudentsData?.result);
    }
  }, [gradeLevelsData, teachersData, unassignedStudentsData]);

  useEffect(() => {
    if (gradeLevelIdFromQuery) {
      setSelectedGradeLevelId(gradeLevelIdFromQuery);
    }
  }, [gradeLevelIdFromQuery]);
  
  const initialValues: SectionFormData = {
    name: '',
    students: [],
    gradeLevelId: gradeLevelIdFromQuery || '',
    homeRoom: '',
  };

  const handleSubmit = async (values: SectionFormData) => {
    try {
      const payload = {
        ...values,
        gradeLevelId: selectedGradeLevelId || values.gradeLevelId,
      };
      await addSection(payload);
      toast.success('Section added successfully');
      router.back();
    } catch (error) {
      toast.error(`Failed to add section: ${error}`);
      console.error('Error adding section:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Section</h1>
          <Button
            asChild
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <Link href="/dashboard/sections" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={sectionSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Section Name
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Section B"
                    className="max-w-md"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Students Multi-Select Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Students
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-w-md justify-between"
                      >
                        {values.students.length > 0
                          ? `${values.students.length} student(s) selected`
                          : "Select students"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-md p-0" style={{ width: 'var(--radix-popover-trigger-width)', maxHeight: 300, overflow: 'auto' }}>
                      <Command>
                        <CommandInput placeholder="Search students..." />
                        <CommandEmpty>No students found.</CommandEmpty>
                        <CommandGroup>
                          {students?.map((student: Student) => (
                            <CommandItem
                              key={student.id}
                              value={student.id}
                              onSelect={() => {
                                const newStudents = values.students.includes(student.id)
                                  ? values.students.filter((id) => id !== student.id)
                                  : [...values.students, student.id];
                                setFieldValue('students', newStudents);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  values.students.includes(student.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {student.user.firstName} {student.user.lastName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage
                    name="students"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p className="text-sm text-muted-foreground">
                    Selected: {values.students.length} student(s)
                  </p>
                </div>

                {/* Grade Level Dropdown - Only show if not provided in query */}
                {!gradeLevelIdFromQuery && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Grade Level
                    </Label>
                    <Select
                      value={values.gradeLevelId}
                      onValueChange={(value) => setFieldValue('gradeLevelId', value)}
                    >
                      <SelectTrigger className="w-full max-w-md">
                        <SelectValue>
                          {values.gradeLevelId
                            ? gradeLevels.find(gl => gl.id === values.gradeLevelId)?.level
                            : "Select grade level"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels?.map((gradeLevel: GradeLevel) => (
                          <SelectItem key={gradeLevel.id} value={gradeLevel.id}>
                            {gradeLevel.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="gradeLevelId"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

                {/* Home Room (Teacher) Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Home Room Teacher
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-w-md justify-between"
                      >
                        {values.homeRoom
                          ? (() => {
                              const teacher = teachers.find(t => t.id === values.homeRoom);
                              return teacher ? `${teacher.user.firstName} ${teacher.user.lastName}` : "Select teacher";
                            })()
                          : "Select teacher"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-md p-0" style={{ width: 'var(--radix-popover-trigger-width)', maxHeight: 300, overflow: 'auto' }}>
                      {teachers?.map((teacher: Teacher) => (
                        <div
                          key={teacher.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                          onClick={() => setFieldValue('homeRoom', teacher.id)}
                        >
                          {teacher.user.firstName} {teacher.user.lastName}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage
                    name="homeRoom"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* Form Actions */}
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
                      Creating...
                    </>
                  ) : (
                    'Create Section'
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

export default AddSectionsView;