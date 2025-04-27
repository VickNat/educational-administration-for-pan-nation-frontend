'use client'  

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../app/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  RiDashboardLine,
  RiMessageLine,
  RiSettingsLine,
  RiTeamLine,
  RiGroupLine,
  RiBookLine,
  RiFileListLine,
  RiCalendarEventLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from 'react-icons/ri';

const navItems = {
  common: [
    { name: 'Dashboard', href: '/dashboard', icon: <RiDashboardLine /> },
    { name: 'Message', href: '/dashboard/messages', icon: <RiMessageLine /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <RiSettingsLine /> },
  ],
  DIRECTOR: [
    { name: 'Teachers', href: '/dashboard/teachers', icon: <RiTeamLine /> },
    { name: 'Students', href: '/dashboard/students', icon: <RiGroupLine /> },
    { name: 'Classes', href: '/dashboard/classes', icon: <RiBookLine /> },
    { name: 'Subjects', href: '/dashboard/subjects', icon: <RiFileListLine /> },
    { name: 'Events', href: '/dashboard/events', icon: <RiCalendarEventLine /> },
  ],
  TEACHER: [
    { name: 'Classes', href: '/dashboard/classes', icon: <RiBookLine /> },
    { name: 'Subjects', href: '/dashboard/subjects', icon: <RiFileListLine /> },
    { name: 'Events', href: '/dashboard/events', icon: <RiCalendarEventLine /> },
  ],
  PARENT: [
    { name: 'Children', href: '/dashboard/children', icon: <RiGroupLine /> },
    { name: 'Events', href: '/dashboard/events', icon: <RiCalendarEventLine /> },
  ],
};

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role;

  // Compose navigation based on role
  const items = [
    ...navItems.common,
    ...(role && navItems[role] ? navItems[role] : []),
  ];

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r flex flex-col py-6 transition-all duration-300 shadow-sm z-20',
        open ? 'w-64 px-4' : 'w-20 px-2'
      )}
    >
      <div className={cn('flex items-center mb-8', open ? 'gap-2 px-2 justify-between' : 'justify-start')}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Class Bridge Logo"
            className={cn('transition-all duration-300', open ? 'h-8 w-8' : 'h-8 w-8 mx-auto')}
          />
          {open && <span className="font-bold text-xl text-primary">Class Bridge</span>}
        </Link>
        <button
          className={cn(
            'ml-auto p-1 rounded hover:bg-muted transition-colors',
            open ? '' : 'absolute top-6 left-11'
          )}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setOpen(!open)}
        >
          {open ? <RiArrowLeftSLine className="text-2xl" /> : <RiArrowRightSLine className="text-2xl" />}
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-muted-foreground hover:bg-muted transition-colors',
                  open ? 'justify-start' : 'justify-start'
                )}
                title={!open ? item.name : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {open && item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}