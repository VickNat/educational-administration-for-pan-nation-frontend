import React, { useState } from 'react'
import { Section, TeacherSectionSubject, Teacher, Subject } from '@/lib/utils/types';
import { useGetSubjects } from '@/queries/subjects/queries';
import { useGetTeachers } from '@/queries/teachers/queries';
import { useAssignTeacherToSection } from '@/queries/teachers/mutation';
import { Button } from '@/components/ui/button';
import { RiUserAddLine } from 'react-icons/ri';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeachersAssignedTabProps {
  sectionData: Section;
  teacherSectionSubject: TeacherSectionSubject[];
}

const TeachersAssignedTab = ({ sectionData, teacherSectionSubject }: TeachersAssignedTabProps) => {
  const { data: teachers } = useGetTeachers();
  const { data: subjects } = useGetSubjects();
  const { mutateAsync: assignTeacher, isPending } = useAssignTeacherToSection();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const validationSchema = Yup.object({
    teacherId: Yup.string().required('Teacher is required'),
    subjectId: Yup.string().required('Subject is required'),
  });

  const handleAssignTeacher = async (values: { teacherId: string; subjectId: string }) => {
    try {
      await assignTeacher({
        sectionId: sectionData.id,
        teacherId: values.teacherId,
        subjectId: values.subjectId,
      });
      toast.success('Teacher assigned successfully');
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to assign teacher');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Assigned Teachers
        </h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setIsAssignDialogOpen(true)}
        >
          <RiUserAddLine className="w-4 h-4" /> Assign Teacher
        </Button>
      </div>

      {teacherSectionSubject.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherSectionSubject.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    {`${assignment.teacher.user.firstName} ${assignment.teacher.user.lastName}`}
                  </TableCell>
                  <TableCell>{assignment.subject.name}</TableCell>
                  <TableCell>{assignment.teacher.user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No teachers assigned to this section.
        </p>
      )}

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Teacher to Section</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{ teacherId: '', subjectId: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAssignTeacher}
          >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form className="space-y-4">
                <div className='flex gap-2 items-center justify-between'>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teacher</label>
                    <Select
                      value={values.teacherId}
                      onValueChange={(value) => setFieldValue('teacherId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers?.result.map((teacher: Teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {`${teacher.user.firstName} ${teacher.user.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teacherId && touched.teacherId && (
                      <div className="text-red-500 text-xs">{errors.teacherId}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select
                      value={values.subjectId}
                      onValueChange={(value) => setFieldValue('subjectId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.result.map((subject: Subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subjectId && touched.subjectId && (
                      <div className="text-red-500 text-xs">{errors.subjectId}</div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAssignDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || isPending}
                  >
                    {(isSubmitting || isPending) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Assign'
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersAssignedTab;