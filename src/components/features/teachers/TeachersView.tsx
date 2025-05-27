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
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

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
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activationFilter, setActivationFilter] = useState<string>('all');
  const { t } = useTranslation();

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
      console.log("error", error)
      toast.error('Failed to delete teacher because the current teacher has a relation.');
    }
  };

  // Filter teachers based on search and activation filter
  const filteredTeachers = teachersData.filter(teacher => {
    const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`.toLowerCase();
    const email = teacher.user.email.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchesActivation = activationFilter === 'all' ? true : activationFilter === 'activated' ? teacher.isActivated : !teacher.isActivated;
    return matchesSearch && matchesActivation;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('teachers.title')}</h1>
          {user?.user.role === 'DIRECTOR' && (
            <Button asChild>
              <Link href="/dashboard/teachers/add">{t('teachers.addTeacher')}</Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              type="text"
              placeholder={t('teachers.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={activationFilter} onValueChange={setActivationFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('teachers.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="activated">{t('common.activated')}</SelectItem>
                <SelectItem value="deactivated">{t('common.deactivated')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>{t('common.profile')}</TableHead>
                  <TableHead>{t('teachers.teacherName')}</TableHead>
                  <TableHead>{t('common.email')}</TableHead>
                  <TableHead>{t('common.phoneNumber')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="text-center">{t('common.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)} className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>
                      {teacher.user.profile ? (
                        <img
                          src={teacher.user.profile || ''}
                          alt={`${teacher.user.firstName} ${teacher.user.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                          {teacher.user.firstName.charAt(0)}{teacher.user.lastName.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>{`${teacher.user.firstName} ${teacher.user.lastName}`}</TableCell>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>{teacher.user.email}</TableCell>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>{teacher.user.phoneNumber}</TableCell>
                    <TableCell onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>
                      {teacher.isActivated ? t('common.activated') : t('common.deactivated')}
                    </TableCell>
                    <TableCell className="text-center">
                      {canEdit && (
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/teachers/${teacher.id}`);
                            }}
                          >
                            <RiEdit2Line className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(teacher);
                            }}
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
            <DialogTitle>{t('common.delete')}</DialogTitle>
            <DialogDescription>
              {t('teachers.deleteConfirmation')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? t('common.loading') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersView;