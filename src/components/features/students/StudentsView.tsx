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
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

// Add the following type definition at the top of the file, after the imports
type Section = {
  id: string;
  name: string;
  gradeLevelId: string;
  teacherId: string;
};

// Rename the local Student type to StudentWithSection
type StudentWithSection = {
  id: string;
  userId: string;
  sectionId: string;
  parentId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isPhoneVerified: boolean;
    isBlocked: boolean;
    profile: string | null;
    phoneNumber: string;
    gender: string | null;
    dateOfBirth: string | null;
    curseNumber: number;
    role: string;
  };
  section?: Section;
};

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
  const [studentsData, setStudentsData] = useState<StudentWithSection[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithSection | null>(null);
  const { mutateAsync: deleteStudent, isPending } = useDeleteStudent(selectedStudent?.id as string);
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  useEffect(() => {
    if (data) {
      setStudentsData(data.result);
    }
  }, [data]);
  
  // Update the canEdit function to use StudentWithSection
  const canEdit = (student: StudentWithSection) => {
    return user?.user?.role === 'DIRECTOR';
  };

  // Update the handleDeleteClick function to use StudentWithSection
  const handleDeleteClick = (student: StudentWithSection) => {
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

  // Update the filteredStudents logic to handle unassigned students
  const filteredStudents = studentsData.filter(student => {
    const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
    const email = student.user.email.toLowerCase();
    const sectionName = student.section?.name?.toLowerCase() || '';
    const matchesSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchesSection = sectionFilter === 'all' ? true : sectionFilter === 'unassigned' ? !student.section : student.section?.id === sectionFilter;
    return matchesSearch && matchesSection;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Update the uniqueSections logic to include an option for unassigned students
  const uniqueSections = Array.from(new Set(studentsData.map(student => student.section?.id || ''))).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            {/* <p className="text-sm text-muted-foreground">Manage / Students</p> */}
          </div>
          {/* <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/students/add">Add student</Link>
          </Button> */}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="unassigned">Unassigned Students</SelectItem>
                {uniqueSections.map(sectionId => (
                  <SelectItem key={sectionId} value={sectionId || ''}>
                    {studentsData.find(s => s.section?.id === sectionId)?.section?.name || 'Unknown Section'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Parent ID</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student, index) => (
                  <TableRow key={student.id} onClick={() => router.push(`/dashboard/student/${student.id}`)}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>
                      {student.user.profile ? (
                        <img
                          src={student.user.profile}
                          alt={`${student.user.firstName} ${student.user.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                          {student.user.firstName.charAt(0)}{student.user.lastName.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{`${student.user.firstName} ${student.user.lastName}`}</TableCell>
                    <TableCell>{student.section?.name || 'N/A'}</TableCell>
                    <TableCell>{student.parentId}</TableCell>
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

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
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