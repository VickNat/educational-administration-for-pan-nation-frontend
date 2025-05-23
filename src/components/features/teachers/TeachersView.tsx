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
import { useGetTeachers } from '@/queries/teachers/queries';
import { Teacher } from '@/lib/utils/types';
import { useDeleteTeacher } from '@/queries/teachers/mutation';
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

// Dummy data for teachers
const teachersData = [
  {
    id: "tch001",
    firstName: "Manang",
    lastName: "Lama",
    email: "manang@gmail.com",
    phoneNumber: "1234567890",
  },
  {
    id: "tch002",
    firstName: "Abebe",
    lastName: "Chala",
    email: "abebe@gmail.com",
    phoneNumber: "0987654321",
  },
];

const TeachersView = () => {
  const { data, isLoading } = useGetTeachers();
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const { mutateAsync: deleteTeacher, isPending } = useDeleteTeacher(selectedTeacher?.id as string);
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setTeachersData(data.result);
    }
  }, [data]);

  const canEdit = user?.user?.role === 'DIRECTOR';

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) return;
    
    try {
      await deleteTeacher();
      toast.success('Teacher deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Teachers</h1>
            {/* <p className="text-sm text-muted-foreground">Manage / Teachers</p> */}
          </div>
          {canEdit && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/teachers/add">Add teacher</Link>
            </Button>
          )}
        </div>

        {/* Table Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Teachers</h2>
            <div>
              <Input
                type="text"
                placeholder="Search..."
                className="w-48 ml-auto"
              />
            </div>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Teacher name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachersData.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{`${teacher.user.firstName} ${teacher.user.lastName}`}</TableCell>
                    <TableCell>{teacher.user.email}</TableCell>
                    <TableCell>{teacher.user.phoneNumber}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {canEdit && (
                          <>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/teachers/${teacher.id}`}>
                                <RiEdit2Line className="h-5 w-5 text-gray-600" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(teacher)}
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
            <DialogTitle>Delete Teacher</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTeacher?.user.firstName} {selectedTeacher?.user.lastName}? This action cannot be undone.
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

export default TeachersView;