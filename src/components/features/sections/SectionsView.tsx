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
import { useGetSections } from '@/queries/sections/queries';
import { useDeleteSection } from '@/queries/sections/mutations';
import { Section } from '@/lib/utils/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const SectionsView = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const { data, refetch } = useGetSections();
  const { mutateAsync: deleteSection, isPending: isDeleting } = useDeleteSection(sectionToDelete?.id || '');

  useEffect(() => {
    if (data) {
      setSections(data.result);
    }
  }, [data]);

  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;

    try {
      await deleteSection(undefined, {
        onSuccess: () => {
          toast.success('Section deleted successfully');
          setIsDeleteDialogOpen(false);
          setSectionToDelete(null);
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to delete section');
          console.error('Delete section error:', error);
        },
      });
    } catch (error) {
      toast.error('Failed to delete section');
      console.error('Delete section error:', error);
    }
  };

  const openDeleteDialog = (section: Section) => {
    setSectionToDelete(section);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section (No Path) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sections</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/sections/add">Add section</Link>
          </Button>
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Sections</h2>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Grade Level</TableHead>
                  <TableHead>Home Room Teacher</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section, index) => (
                  <TableRow key={section.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{section.name}</TableCell>
                    <TableCell>{section.gradeLevel?.level || 'N/A'}</TableCell>
                    <TableCell>
                      {section.homeRoom?.user.firstName} {section.homeRoom?.user.lastName}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/sections/${section.id}`}>
                            <RiEdit2Line className="h-5 w-5 text-gray-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(section)}
                          disabled={isDeleting}
                        >
                          <RiDeleteBinLine className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
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
                Are you sure you want to delete the section "{sectionToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSectionToDelete(null);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteSection}
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

export default SectionsView;