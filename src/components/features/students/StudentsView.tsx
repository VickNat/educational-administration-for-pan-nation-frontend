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
import Link from 'next/link';
import { useGetStudents } from '@/queries/students/queries';
import { Student } from '@/lib/utils/types';
import { useDeleteStudent } from '@/queries/students/mutations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Dummy data for students
const studentsData = [
  {
    id: "cma18hax10002a426fl3qbfya",
    firstName: "Test",
    lastName: "Student",
    email: "test1@email.com",
    phoneNumber: "251983082255",
  },
  {
    id: "cma18hax10003a426fl3qbfyb",
    firstName: "Abebe",
    lastName: "Chala",
    email: "abebe@gmail.com",
    phoneNumber: "09876542",
  },
];

const StudentsView = () => {
  const { data, isLoading } = useGetStudents();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { mutateAsync: deleteStudent, isPending } = useDeleteStudent(selectedStudent?.id as string);
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setStudentsData(data.result);
    }
  }, [data]);
  
  console.log("studentsData", studentsData);

  const canEdit = (student: Student) => {
    return user?.role === 'TEACHER' || 
           user?.role === 'DIRECTOR' || 
           (user?.role === 'PARENT' && user?.id === student.parentId);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    
    try {
      await deleteStudent();
      toast.success('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Students</h1>
            {/* <p className="text-sm text-muted-foreground">Manage / Students</p> */}
          </div>
          {/* <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/students/add">Add student</Link>
          </Button> */}
        </div>

        {/* Table Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Students</h2>
            <div className="">
              <Input
                type="text"
                placeholder="Search..."
                className="w-48"
              />
            </div>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Student name</TableHead>
                  {/* <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead> */}
                  <TableHead>Parent</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsData.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{`${student.user.firstName} ${student.user.lastName}`}</TableCell>
                    {/* <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.user.phoneNumber}</TableCell> */}
                    <TableCell>{student.parentId}</TableCell>
                    <TableCell>{student.sectionId}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {canEdit(student) && (
                          <>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/student/${student.id}`}>
                                <RiEdit2Line className="h-5 w-5 text-gray-600" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(student)}
                            >
                              <RiDeleteBinLine className="h-5 w-5 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.user.firstName} {selectedStudent?.user.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsView;