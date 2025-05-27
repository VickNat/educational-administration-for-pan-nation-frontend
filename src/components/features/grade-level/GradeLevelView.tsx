'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiEdit2Line, RiDeleteBinLine, RiMore2Line, RiMessage2Line } from 'react-icons/ri';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';

const GradeLevelView = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [gradeLevelsData, setGradeLevelsData] = useState<GradeLevel[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gradeLevelToDelete, setGradeLevelToDelete] = useState<GradeLevel | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<GradeLevel | null>(null);
  const { data, refetch } = useGetGradeLevels();
  const { mutateAsync: deleteGradeLevel, isPending: isDeleting } = useDeleteGradeLevel(gradeLevelToDelete?.id || '');
  const [popoverOpenId, setPopoverOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sectionSearch, setSectionSearch] = useState('');

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
    setPopoverOpenId(null);
  };

  // Card for each section
  const SectionCard = ({ section }: { section: any }) => (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 flex flex-col items-start shadow-none hover:border-primary/40 transition-all cursor-pointer" onClick={() => router.push(`/dashboard/sections/${section.id}`)}>
      <div className="text-lg font-semibold text-gray-900 mb-1">{section.name}</div>
      {/* <div className="text-xs text-muted-foreground">Section ID: {section.id}</div> */}
    </div>
  );

  // Card for each grade level
  const GradeLevelCard = ({ gradeLevel }: { gradeLevel: GradeLevel }) => (
    <div
      className={`relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 flex flex-col justify-between shadow-none hover:border-primary/40 transition-all cursor-pointer min-h-[120px] group`}
      onClick={() => setSelectedGradeLevel(gradeLevel)}
    >
      {/* 3-dots popover menu */}
      <Popover open={popoverOpenId === gradeLevel.id} onOpenChange={open => setPopoverOpenId(open ? gradeLevel.id : null)}>
        <PopoverTrigger asChild>
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 focus:outline-none"
            onClick={e => { e.stopPropagation(); setPopoverOpenId(gradeLevel.id); }}
          >
            <RiMore2Line className="w-6 h-6 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40 p-2">
          {user?.user.role === 'DIRECTOR' && (
            <>
              <Link href={`/dashboard/grade-level/${gradeLevel.id}`} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/5 text-sm text-gray-800">
                <RiEdit2Line className="w-4 h-4" /> Edit
              </Link>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600 w-full"
                onClick={e => { e.stopPropagation(); openDeleteDialog(gradeLevel); }}
              >
                <RiDeleteBinLine className="w-4 h-4" /> Delete
              </button>
            </>
          )}
          {user?.user.role !== 'DIRECTOR' && (
            <Link href={`/dashboard/grade-level/${gradeLevel.id}?tab=chat`} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/5 text-sm text-gray-800">
              <RiMessage2Line className="w-4 h-4" /> Messages
            </Link>
          )}
        </PopoverContent>
      </Popover>
      <div className="text-2xl font-bold text-gray-900 mb-2">{gradeLevel.level}</div>
      {/* <div className="text-xs text-muted-foreground">ID: {gradeLevel.id}</div> */}
      <div className="mt-2 text-xs text-muted-foreground">{gradeLevel.Section?.length || 0} Sections</div>
    </div>
  );

  // Filtered grade levels
  const filteredGradeLevels = gradeLevelsData.filter(gl =>
    gl.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Grade Levels</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search grade levels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild>
              <Link href="/dashboard/grade-level/add">Add grade level</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Grade Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGradeLevels.map((gradeLevel) => (
          <GradeLevelCard key={gradeLevel.id} gradeLevel={gradeLevel} />
        ))}
      </div>

      {/* Sections for selected grade level */}
      {selectedGradeLevel && (
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6 w-full justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Sections in {selectedGradeLevel.level}</h2>
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <Input
                type="text"
                placeholder="Search sections..."
                value={sectionSearch}
                onChange={e => setSectionSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button variant="ghost" onClick={() => setSelectedGradeLevel(null)}>
                Back to Grade Levels
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedGradeLevel.Section && selectedGradeLevel.Section.length > 0 ? (
              selectedGradeLevel.Section.filter((section: any) =>
                section.name.toLowerCase().includes(sectionSearch.toLowerCase())
              ).map((section: any) => (
                <SectionCard key={section.id} section={section} />
              ))
            ) : (
              <div className="col-span-full text-muted-foreground text-center py-8">No sections found for this grade level.</div>
            )}
          </div>
        </div>
      )}

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
  );
};

export default GradeLevelView;