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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import Link from 'next/link';
import { useGetParents } from '@/queries/parents/queries';
import { Parent } from '@/lib/utils/types';
import { useDeleteParent } from '@/queries/parents/mutations';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const ParentsView = () => {
  const { data, refetch } = useGetParents();
  const [parentsData, setParentsData] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutateAsync: deleteParent, isPending } = useDeleteParent(selectedParent?.id || '');
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activationFilter, setActivationFilter] = useState<string>('all');

  useEffect(() => {
    if (data && data?.result) {
      setParentsData(data.result);
    }
  }, [data]);

  const handleDelete = async () => {
    try {
      await deleteParent();
      toast.success('Parent deleted successfully');
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedParent(null);
    } catch (error) {
      toast.error('Failed to delete parent');
      console.error('Error deleting parent:', error);
    }
  };

  // Filter parents based on search and activation filter
  const filteredParents = parentsData.filter((parent: any) => {
    const fullName = `${parent.user.firstName} ${parent.user.lastName}`.toLowerCase();
    const email = parent.user.email.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchesActivation = activationFilter === 'all' ? true : activationFilter === 'activated' ? parent.isActivated : !parent.isActivated;
    return matchesSearch && matchesActivation;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParents = filteredParents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Parents</h1>
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild >
              <Link href="/dashboard/parents/add-with-child">Add parent</Link>
            </Button>
          )}
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
            <Select value={activationFilter} onValueChange={setActivationFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by activation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parents</SelectItem>
                <SelectItem value="activated">Activated</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParents.map((parent: any, index) => (
                <TableRow onClick={() => router.push(`/dashboard/parents/${parent.id}`)} key={parent.id}>
                  <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                  <TableCell>
                    {parent.user.profile ? (
                      <img
                        src={parent.user.profile || ''}
                        alt={`${parent.user.firstName} ${parent.user.lastName}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {parent.user.firstName.charAt(0)}{parent.user.lastName.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{parent.user.firstName} {parent.user.lastName}</TableCell>
                  <TableCell>{parent.user.email}</TableCell>
                  <TableCell>{parent.user.phoneNumber}</TableCell>
                  <TableCell>{parent.isActivated ? 'Activated' : 'Deactivated'}</TableCell>
                  {user?.user.role === 'DIRECTOR' && (
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/parents/${parent.id}`}>
                            <RiEdit2Line className="h-5 w-5 text-gray-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedParent(parent);
                            setIsDeleteModalOpen(true);
                          }}
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Parent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedParent?.user.firstName} {selectedParent?.user.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedParent(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
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

export default ParentsView;