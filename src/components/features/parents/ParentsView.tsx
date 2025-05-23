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
// Dummy data for parents
const parentsData = [
  { id: 1, name: 'Manang Lama', address: 'Dolpa', email: 'manang@gmail.com', username: '@manang', password: 'manang123' },
  { id: 2, name: 'Manang Lama', address: 'Dolpa', email: 'manang@gmail.com', username: '@manang', password: 'manang123' },
  { id: 3, name: 'Manang Lama', address: 'Dolpa', email: 'manang@gmail.com', username: '@manang', password: 'manang123' },
  { id: 4, name: 'Manang Lama', address: 'Dolpa', email: 'manang@gmail.com', username: '@manang', password: 'manang123' },
];

const ParentsView = () => {
  const { data, refetch } = useGetParents();
  const [parentsData, setParentsData] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutateAsync: deleteParent, isPending } = useDeleteParent(selectedParent?.id || '');
  const router = useRouter();
  const { user } = useAuth();
  
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Parent</h1>
          </div>
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/parents/add">Add parent</Link>
            </Button>
          )}
        </div>

        {/* Table Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Parents</h2>
            <div className="relative mb-4">
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
                  <TableHead>Parent name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentsData.map((parent, index) => (
                  <TableRow onClick={() => router.push(`/dashboard/parents/${parent.id}`)} key={parent.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{parent.user.firstName} {parent.user.lastName}</TableCell>
                    <TableCell>{parent.user.email}</TableCell>
                    <TableCell>{parent.user.phoneNumber}</TableCell>
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