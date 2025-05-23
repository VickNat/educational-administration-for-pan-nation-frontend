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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useGetGradeLevels } from '@/queries/grade-level/queries';
import { GradeLevel } from '@/lib/utils/types';
import { useDeleteGradeLevel } from '@/queries/grade-level/mutations';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

// Dummy data for grade levels
const initialGradeLevelsData = [
  {
    id: "grade001",
    name: "Grade 1",
  },
  {
    id: "grade002",
    name: "Grade 2",
  },
];

const GradeLevelView = () => {
  const { user } = useAuth();
  const [gradeLevelsData, setGradeLevelsData] = useState<GradeLevel[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gradeLevelToDelete, setGradeLevelToDelete] = useState<GradeLevel | null>(null);
  const { data, refetch } = useGetGradeLevels();
  const { mutateAsync: deleteGradeLevel, isPending: isDeleting } = useDeleteGradeLevel(gradeLevelToDelete?.id || '');

  useEffect(() => {
    if (data) {
      setGradeLevelsData(data?.result);
    }
  }, [data]);

  const handleDeleteGradeLevel = async () => {
    if (!gradeLevelToDelete) return;

    await deleteGradeLevel(undefined, {
      onSuccess: () => {
        toast.success('Grade level deleted successfully');
        setIsDeleteDialogOpen(false);
        setGradeLevelToDelete(null);
        refetch();
      },
      onError: (error) => {
        toast.error('Failed to delete grade level');
        console.error('Delete grade level error:', error);
      },
    });
  };

  const openDeleteDialog = (gradeLevel: GradeLevel) => {
    setGradeLevelToDelete(gradeLevel);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Grade Levels</h1>
            {/* <p className="text-sm text-muted-foreground">Manage / Grade Levels</p> */}
          </div>
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/grade-level/add">Add grade level</Link>
            </Button>
          )}
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Grade Levels</h2>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-48 ml-auto"
            />
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  {user?.user.role === 'DIRECTOR' && (
                    <TableHead className="text-center">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeLevelsData.map((gradeLevel, index) => (
                  <TableRow key={gradeLevel.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{gradeLevel.id}</TableCell>
                    <TableCell>{gradeLevel.level}</TableCell>
                    {user?.user.role === 'DIRECTOR' && (
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/grade-level/${gradeLevel.id}`}>
                            <RiEdit2Line className="h-5 w-5 text-gray-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(gradeLevel)}
                          disabled={isDeleting}
                        >
                          <RiDeleteBinLine className="h-5 w-5 text-red-500" />
                        </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the grade level "
                {gradeLevelToDelete?.level}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setGradeLevelToDelete(null);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteGradeLevel}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
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
    </div>
  );
};

export default GradeLevelView;