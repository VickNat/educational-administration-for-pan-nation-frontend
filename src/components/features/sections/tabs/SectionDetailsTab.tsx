'use client'

import React from 'react';
import { Formik, Form } from 'formik';
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
import { Section, Teacher } from '@/lib/utils/types';
import { useGetTeachers } from '@/queries/teachers/queries';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useUpdateSection } from '@/queries/sections/mutations';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface SectionDetailsTabProps {
  sectionData: Section;
  isHomeRoom: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  homeRoom: Yup.string().required('Home room teacher is required'),
});

const SectionDetailsTab: React.FC<SectionDetailsTabProps> = ({ sectionData, isHomeRoom }) => {
  const { data: teachersData } = useGetTeachers();
  const { mutateAsync: updateSection } = useUpdateSection(sectionData.id);
  const { user } = useAuth();

  const initialValues = {
    name: sectionData.name,
    homeRoom: sectionData.homeRoom?.id || '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateSection(values);
      toast.success('Section updated successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  return (
    <div className="space-y-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section ID */}
              <div>
                <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                  Section ID
                </Label>
                <Input
                  id="id"
                  type="text"
                  value={sectionData.id}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  disabled={!isHomeRoom && user?.user.role !== 'DIRECTOR'}
                  className="mt-1"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* Grade Level ID */}
              <div>
                <Label htmlFor="gradeLevelId" className="text-sm font-medium text-gray-700">
                  Grade Level ID
                </Label>
                <Input
                  id="gradeLevelId"
                  type="text"
                  value={sectionData.gradeLevelId}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>

              {/* Grade Level */}
              <div>
                <Label htmlFor="gradeLevel" className="text-sm font-medium text-gray-700">
                  Grade Level
                </Label>
                <Input
                  id="gradeLevel"
                  type="text"
                  value={sectionData.gradeLevel?.level}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>

              {/* Home Room Teacher */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Home Room Teacher
                </Label>
                <Select
                  value={values.homeRoom}
                  onValueChange={(value) => setFieldValue('homeRoom', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachersData?.result.map((teacher: Teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {`${teacher.user.firstName} ${teacher.user.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.homeRoom && touched.homeRoom && (
                  <div className="text-red-500 text-sm mt-1">{errors.homeRoom}</div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {(user?.user.role === 'DIRECTOR' || isHomeRoom) && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SectionDetailsTab;