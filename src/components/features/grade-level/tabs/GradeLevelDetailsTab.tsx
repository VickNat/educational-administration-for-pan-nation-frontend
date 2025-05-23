'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradeLevel } from '@/lib/utils/types';
import { useUpdateGradeLevel } from '@/queries/grade-level/mutations';
import { Formik, Form } from 'formik';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';

interface GradeLevelDetailsTabProps {
  gradeLevel: GradeLevel;
  canEdit: boolean;
}

const validationSchema = Yup.object().shape({
  level: Yup.string().required('Level is required'),
});

const GradeLevelDetailsTab: React.FC<GradeLevelDetailsTabProps> = ({ gradeLevel, canEdit }) => {
  const { mutateAsync: updateGradeLevel, isPending } = useUpdateGradeLevel(gradeLevel.id);

  const initialValues = {
    level: gradeLevel.level,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateGradeLevel(values);
      toast.success('Grade level updated successfully');
    } catch (error) {
      console.error('Error updating grade level:', error);
      toast.error('Failed to update grade level');
    }
  };

  return (
    <div className="space-y-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form className="space-y-6">
            <div>
              <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                Grade Level
              </Label>
              <Input
                id="level"
                name="level"
                type="text"
                value={values.level}
                onChange={handleChange}
                disabled={!canEdit || isPending}
                className="mt-1"
              />
              {errors.level && touched.level && (
                <div className="text-red-500 text-sm mt-1">{errors.level}</div>
              )}
            </div>

            {canEdit && (
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </Form>
        )}
      </Formik>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subjects in {gradeLevel.level}
        </h2>
        {gradeLevel.subjectList && gradeLevel.subjectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeLevel.subjectList.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">
                  {subject.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No subjects assigned to this grade level.
          </p>
        )}
      </div>
    </div>
  );
};

export default GradeLevelDetailsTab; 