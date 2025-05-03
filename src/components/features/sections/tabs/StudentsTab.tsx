'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Student } from '@/lib/utils/types';
import { RiDeleteBinLine, RiUserAddLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { useAddStudentsToSection, useRemoveStudentsFromSection } from '@/queries/sections/mutations';
import { useGetStudents } from '@/queries/students/queries';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface StudentsTabProps {
  sectionId: string;
  sectionName: string;
  studentsData: Student[];
}

// Dummy data for students
const dummyStudents: Student[] = [
  {
    id: "studentId1",
    userId: "userId1",
    sectionId: "section1",
    parentId: "parent1",
    user: {
      id: "userId1",
      firstName: "Abebe",
      lastName: "Chala",
      email: "abebe@gmail.com",
      password: "dummy",
      phoneNumber: "1234567890",
      role: "STUDENT"
    },
  },
  {
    id: "studentId2",
    userId: "userId2",
    sectionId: "section1",
    parentId: "parent2",
    user: {
      id: "userId2",
      firstName: "Test",
      lastName: "Student",
      email: "test@gmail.com",
      password: "dummy",
      phoneNumber: "1234567890",
      role: "STUDENT"
    },
  },
];

const StudentsTab: React.FC<StudentsTabProps> = ({ sectionId, sectionName, studentsData }) => {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addSelectedIds, setAddSelectedIds] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { mutateAsync: removeStudentsFromSection } = useRemoveStudentsFromSection(sectionId);
  const { mutateAsync: addStudentsToSection } = useAddStudentsToSection(sectionId);
  const { data: studentsToDisplay } = useGetStudents();
  const [studentsToDisplayData, setStudentsToDisplayData] = useState<Student[]>(studentsToDisplay?.result || []);

  useEffect(() => {
    if (studentsToDisplay) {
      setStudentsToDisplayData(studentsToDisplay.result);
    }
  }, [studentsToDisplay]);

  // Filter students not already in the section
  const availableToAdd = studentsToDisplayData.filter(
    (s) => !students.some((inSection) => inSection.id === s.id)
  );

  // Multi-select logic
  const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };
  const toggleSelect = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Remove selected students
  const handleRemoveSelected = async () => {
    if (selectedStudentIds.length === 0) return;
    setIsRemoving(true);
    try {
      await removeStudentsFromSection(selectedStudentIds);
      setStudents((prev) => prev.filter((s) => !selectedStudentIds.includes(s.id)));
      setSelectedStudentIds([]);
      toast.success('Selected students removed from section');
    } catch (error) {
      toast.error('Failed to remove students');
    } finally {
      setIsRemoving(false);
    }
  };

  // Remove single student (dialog)
  const handleRemoveStudent = async () => {
    if (!studentToDelete) return;
    setIsRemoving(true);
    try {
      await removeStudentsFromSection([studentToDelete.id]);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      toast.success('Student removed from section');
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error('Failed to remove student');
    } finally {
      setIsRemoving(false);
    }
  };

  // Add students
  const handleAddStudents = async () => {
    if (addSelectedIds.length === 0) return;
    setIsAdding(true);
    try {
      await addStudentsToSection(addSelectedIds);
      // Add to local state for immediate feedback
      const added = availableToAdd.filter((s) => addSelectedIds.includes(s.id));
      setStudents((prev) => [...prev, ...added]);
      setAddSelectedIds([]);
      setIsAddDialogOpen(false);
      toast.success('Students added to section');
    } catch (error) {
      toast.error('Failed to add students');
    } finally {
      setIsAdding(false);
    }
  };

  const openDeleteDialog = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Students in {sectionName}
        </h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <RiUserAddLine className="w-4 h-4" /> Add Students
        </Button>
      </div>

      {students.length > 0 ? (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 text-center">
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() => toggleSelect(student.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{`${student.user.firstName} ${student.user.lastName}`}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(student)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isRemoving}
                      >
                        Remove from Section
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Remove Selected Button at bottom right */}
          <div className="flex justify-end items-center mt-4 gap-2">
            <span className="text-sm text-gray-500">{selectedStudentIds.length} selected</span>
            <Button
              variant="destructive"
              disabled={selectedStudentIds.length === 0 || isRemoving}
              onClick={handleRemoveSelected}
              className="flex items-center gap-2"
            >
              {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RiDeleteBinLine className="w-4 h-4" />}
              Remove Selected
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No students assigned to this section.
        </p>
      )}

      {/* Remove Student Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              {studentToDelete?.user.firstName} {studentToDelete?.user.lastName} from this section?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setStudentToDelete(null);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRemoveStudent}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove from Section'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Students Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Students to Section</DialogTitle>
            <DialogDescription>
              Select students to add to this section.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto my-4">
            {availableToAdd.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 text-center">
                      <Checkbox
                        checked={addSelectedIds.length === availableToAdd.length && availableToAdd.length > 0}
                        onCheckedChange={() => {
                          if (addSelectedIds.length === availableToAdd.length) {
                            setAddSelectedIds([]);
                          } else {
                            setAddSelectedIds(availableToAdd.map((s) => s.id));
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableToAdd.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={addSelectedIds.includes(student.id)}
                          onCheckedChange={() => {
                            setAddSelectedIds((prev) =>
                              prev.includes(student.id)
                                ? prev.filter((sid) => sid !== student.id)
                                : [...prev, student.id]
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>{`${student.user.firstName} ${student.user.lastName}`}</TableCell>
                      <TableCell>{student.user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No students available to add.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setAddSelectedIds([]);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddStudents}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={addSelectedIds.length === 0 || isAdding}
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsTab; 