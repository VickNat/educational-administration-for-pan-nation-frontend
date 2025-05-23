'use client'

import { GradeLevelSection } from '@/lib/utils/types';
import React from 'react';
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
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';

interface SectionsTabProps {
  gradeLevelId: string;
  sections: GradeLevelSection[];
  canEdit: boolean;
}

const SectionsTab: React.FC<SectionsTabProps> = ({ gradeLevelId, sections, canEdit }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [sectionToDelete, setSectionToDelete] = React.useState<GradeLevelSection | null>(null);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleEdit = (sectionId: string) => {
    router.push(`/dashboard/sections/${sectionId}`);
  };

  const handleRemove = (section: GradeLevelSection) => {
    setSectionToDelete(section);
    setIsDeleteDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!sectionToDelete) return;
    setIsRemoving(true);
    try {
      // Call your delete mutation here, e.g., await deleteSection(sectionToDelete.id);
      toast.success('Section removed successfully');
      setIsDeleteDialogOpen(false);
      setSectionToDelete(null);
    } catch (error) {
      console.error('Error removing section:', error);
      toast.error('Failed to remove section');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section Name</TableHead>
              {canEdit && <TableHead className="text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.name}</TableCell>
                {canEdit && (
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <RiEditLine className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(section)}
                      className="text-red-600 hover:text-red-800"
                      disabled={isRemoving}
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {sectionToDelete?.name}? This action cannot be undone.
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
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionsTab; 