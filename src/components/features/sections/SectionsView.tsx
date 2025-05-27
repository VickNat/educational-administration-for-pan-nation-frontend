'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiEdit2Line, RiDeleteBinLine, RiMore2Line } from 'react-icons/ri';
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
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SectionsView = () => {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [popoverOpenId, setPopoverOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
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
    setPopoverOpenId(null);
  };

  // Filtered sections
  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(search.toLowerCase()) ||
    section.gradeLevel?.level?.toLowerCase().includes(search.toLowerCase())
  );

  // Card for each section
  const SectionCard = ({ section }: { section: Section }) => {
    const homeRoom = section.homeRoom;
    const teacherName = homeRoom ? `${homeRoom.user.firstName} ${homeRoom.user.lastName}` : 'N/A';
    const teacherProfile = homeRoom?.user?.profile;
    const teacherInitials = homeRoom ? `${homeRoom.user.firstName?.[0] || ''}${homeRoom.user.lastName?.[0] || ''}`.toUpperCase() : '';
    const canEditOrDelete = user?.user.role === 'DIRECTOR' || user?.roleId === homeRoom?.id;
    return (
      <div
        className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 flex flex-col gap-4 shadow-none hover:border-primary/40 transition-all cursor-pointer min-h-[140px] group"
        onClick={() => router.push(`/dashboard/sections/${section.id}`)}
      >
        {/* 3-dots popover menu */}
        {canEditOrDelete && (
          <Popover open={popoverOpenId === section.id} onOpenChange={open => setPopoverOpenId(open ? section.id : null)}>
            <PopoverTrigger asChild>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 focus:outline-none"
                onClick={e => { e.stopPropagation(); setPopoverOpenId(section.id); }}
              >
                <RiMore2Line className="w-6 h-6 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-2">
              <Link href={`/dashboard/sections/${section.id}`} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/5 text-sm text-gray-800">
                <RiEdit2Line className="w-4 h-4" /> Edit
              </Link>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600 w-full"
                onClick={e => { e.stopPropagation(); openDeleteDialog(section); }}
              >
                <RiDeleteBinLine className="w-4 h-4" /> Delete
              </button>
            </PopoverContent>
          </Popover>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold text-gray-900 mb-1">{section.name}</div>
          <div className="text-sm text-muted-foreground mb-1">Grade Level: {section.gradeLevel?.level || 'N/A'}</div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            {teacherProfile ? (
              <AvatarImage src={teacherProfile} />
            ) : (
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                {teacherInitials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-xs text-gray-800 font-medium">{teacherName}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search sections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild>
              <Link href="/dashboard/sections/add">Add section</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
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
  );
};

export default SectionsView;