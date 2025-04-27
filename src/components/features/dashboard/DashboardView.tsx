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
} from 'react-icons/ri';
import Link from 'next/link';

const SHORTCUTS = {
  DIRECTOR: [
    {
      icon: <RiTeamLine className="h-8 w-8 text-blue-500 bg-blue-100 rounded p-1" />,
      title: 'Add Teachers',
      description: 'Create rich course content and coaching products for your students. When you give them a pricing plan, they\'ll appear on your site!',
      href: '/dashboard/teachers',
    },
    {
      icon: <RiBookLine className="h-8 w-8 text-green-500 bg-green-100 rounded p-1" />,
      title: 'Add classes',
      description: 'Create rich course content and coaching products for your students. When you give them a pricing plan, they\'ll appear on your site!',
      href: '/dashboard/classes',
    },
    {
      icon: <RiGroupLine className="h-8 w-8 text-purple-500 bg-purple-100 rounded p-1" />,
      title: 'Add students',
      description: 'Add students to your school and assign them to classes.',
      href: '/dashboard/students',
    },
    {
      icon: <RiFileListLine className="h-8 w-8 text-pink-500 bg-pink-100 rounded p-1" />,
      title: 'Add subjects',
      description: 'Manage subjects for your school curriculum.',
      href: '/dashboard/subjects',
    },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded p-1" />,
      title: 'Add events',
      description: 'Create and manage school events.',
      href: '/dashboard/events',
    },
  ],
  TEACHER: [
    {
      icon: <RiBookLine className="h-8 w-8 text-green-500 bg-green-100 rounded p-1" />,
      title: 'My Classes',
      description: 'View and manage your classes.',
      href: '/dashboard/classes',
    },
    {
      icon: <RiFileListLine className="h-8 w-8 text-pink-500 bg-pink-100 rounded p-1" />,
      title: 'My Subjects',
      description: 'View and manage your subjects.',
      href: '/dashboard/subjects',
    },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded p-1" />,
      title: 'School Events',
      description: 'See upcoming school events.',
      href: '/dashboard/events',
    },
  ],
  PARENT: [
    {
      icon: <RiGroupLine className="h-8 w-8 text-purple-500 bg-purple-100 rounded p-1" />,
      title: 'My Children',
      description: 'View your children and their progress.',
      href: '/dashboard/children',
    },
    {
      icon: <RiCalendarEventLine className="h-8 w-8 text-yellow-500 bg-yellow-100 rounded p-1" />,
      title: 'School Events',
      description: 'See upcoming school events.',
      href: '/dashboard/events',
    },
  ],
};

const DashboardView = () => {
  const { user } = useAuth();
  const role = user?.role || 'DIRECTOR';
  const shortcuts = SHORTCUTS[role] || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome to your dashboard, Pan-nation school</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shortcuts.map((shortcut) => (
          <Link href={shortcut.href}>
            <Card key={shortcut.title} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <div>{shortcut.icon}</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{shortcut.title}</h2>
                <p className="text-sm text-muted-foreground">{shortcut.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;