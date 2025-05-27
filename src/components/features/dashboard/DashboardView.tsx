'use client'

import React from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RiTeamLine,
  RiBookLine,
  RiGroupLine,
  RiFileListLine,
  RiCalendarEventLine,
  RiMailLine,
} from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGenerateRoster } from '@/queries/results/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import logo from '@/../public/images/logo.png'

const SHORTCUTS = {
  DIRECTOR: [
    {
      icon: <RiTeamLine className="h-8 w-8 text-blue-500 bg-blue-100 rounded-lg p-1.5" />,
      title: 'Add Teachers',
      description: 'Create and manage teacher profiles for your school.',
      href: '/dashboard/teachers',
    },
    {
      icon: <RiBookLine className="h-8 w-8 text-green-500 bg-green-100 rounded-lg p-1.5" />,
      title: 'Add Sections',
      description: 'Organize classes and assign teachers and students.',
      href: '/dashboard/sections/add',
    },
    {
      icon: <RiGroupLine className="h-8 w-8 text-purple-500 bg-purple-100 rounded-lg p-1.5" />,
      title: 'Add Students',
      description: 'Add students and assign them to classes.',
      href: '/dashboard/student/add',
    },
    {
      icon: <RiFileListLine className="h-8 w-8 text-pink-500 bg-pink-100 rounded-lg p-1.5" />,
      title: 'Add Subjects',
      description: 'Manage subjects for your school curriculum.',
      href: '/dashboard/subjects/add',
    },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded-lg p-1.5" />,
      title: 'Add Events',
      description: 'Plan and manage school events.',
      href: '/dashboard/calendar/add',
    },
  ],
  TEACHER: [
    {
      icon: <RiBookLine className="h-8 w-8 text-green-500 bg-green-100 rounded-lg p-1.5" />,
      title: 'View Sections',
      description: 'View and manage your assigned sections.',
      href: '/dashboard/sections',
    },
    // {
    //   icon: <RiGroupLine className="h-8 w-8 text-purple-500 bg-purple-100 rounded-lg p-1.5" />,
    //   title: 'View Students',
    //   description: 'Manage your students and track their progress.',
    //   href: '/dashboard/students',
    // },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded-lg p-1.5" />,
      title: 'School Calendar',
      description: 'Stay updated with upcoming school events.',
      href: '/dashboard/calendar',
    },
  ],
  PARENT: [
    {
      icon: <RiGroupLine className="h-8 w-8 text-purple-500 bg-purple-100 rounded-lg p-1.5" />,
      title: 'My Children',
      description: "Monitor your children's progress and activities.",
      href: '/dashboard/settings?tab=children',
    },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded-lg p-1.5" />,
      title: 'School Events',
      description: 'View upcoming school events and activities.',
      href: '/dashboard/calendar',
    },
  ],
};

const DashboardView = () => {
  const { user } = useAuth();
  const role = user?.user?.role || 'DIRECTOR';
  const shortcuts = SHORTCUTS[role] || [];
  const { mutateAsync: generateRoster } = useGenerateRoster();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleGenerateRoster = async () => {
    setLoading(true);
    try {
      await generateRoster();
      toast.success('Roster generated and results reset successfully!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to generate roster');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 hover:border-primary/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo and School Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
              <Image
                src={logo}
                alt="School Logo"
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Pan-nation School
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Empowering Education Excellence</p>
            </div>
          </div>

          {/* User Profile Card */}
          <Card
            className="w-full md:w-auto p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-input/30 border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            onClick={() => router.push('/dashboard/settings')}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/30 transition-all duration-300 hover:border-primary/50">
                <AvatarImage src={user?.user?.profile || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold">
                  {getInitials(user?.user?.firstName || '', user?.user?.lastName || '')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary truncate">
                    {`${user?.user?.firstName} ${user?.user?.lastName}`}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-secondary/80 to-primary/80 text-white whitespace-nowrap"
                  >
                    {role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                  <RiMailLine className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="truncate">{user?.user?.email}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Quick Actions
          </h2>
          {role === 'DIRECTOR' && (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
              onClick={() => setOpen(true)}
              disabled={loading}
            >
              Generate Roster
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {shortcuts.map((shortcut) => (
            <Link href={shortcut.href} key={shortcut.title}>
              <Card className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 hover:border-primary/30 hover:scale-[1.02] transition-all duration-300">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {shortcut.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-primary mb-1 truncate">{shortcut.title}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{shortcut.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to generate the new roster?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 mb-4">
            This will promote all students to the next section and grade level, and <span className="font-semibold text-red-600">delete all collective results for the current semester</span>.<br />
            <span className="font-semibold">This action cannot be undone.</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleGenerateRoster} disabled={loading}>
              {loading ? 'Generating...' : 'Yes, Generate Roster'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardView;