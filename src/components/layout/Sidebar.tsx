'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  RiSchoolLine,
  RiMegaphoneLine,
  RiParentLine,
  RiUserSettingsLine,
  RiBookOpenLine,
  RiBookmarkLine,
  RiGraduationCapLine,
  RiUserLine,
  RiLogoutBoxLine,
} from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.user?.role;
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = {
    common: [
      { name: t('common.dashboard'), href: '/dashboard', icon: <RiDashboardLine /> },
      { name: t('common.message'), href: '/dashboard/messages', icon: <RiMessageLine /> },
      { name: t('common.announcements'), href: '/dashboard/announcements', icon: <RiMegaphoneLine /> },
      { name: t('common.gradeLevels'), href: '/dashboard/grade-level', icon: <RiGraduationCapLine /> },
      { name: t('common.sections'), href: '/dashboard/sections', icon: <RiBookmarkLine /> },
      { name: t('common.calendar'), href: '/dashboard/calendar', icon: <RiCalendarEventLine /> },
    ],
    DIRECTOR: [
      { name: t('common.subjects'), href: '/dashboard/subjects', icon: <RiBookOpenLine /> },
      { name: t('common.teachers'), href: '/dashboard/teachers', icon: <RiTeamLine /> },
      { name: t('common.parents'), href: '/dashboard/parents', icon: <RiParentLine /> },
      { name: t('common.students'), href: '/dashboard/student', icon: <RiUserLine /> },
    ],
    TEACHER: [
      { name: t('common.subjects'), href: '/dashboard/subjects', icon: <RiBookOpenLine /> },
      { name: t('common.teachers'), href: '/dashboard/teachers', icon: <RiTeamLine /> },
      { name: t('common.parents'), href: '/dashboard/parents', icon: <RiParentLine /> },
      { name: t('common.students'), href: '/dashboard/student', icon: <RiUserLine /> },
    ],
    PARENT: [
      // { name: 'Section Messages', href: '/dashboard/section-messages', icon: <RiMessageLine /> },
      // { name: 'Children', href: '/dashboard/children', icon: <RiGroupLine /> },
    ],
  };

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
      <div className={cn('flex items-center mb-8', open ? 'gap-2 px-2 justify-between' : 'justify-center')}>
        <Link href="/dashboard" className="flex items-center justify-center gap-2">
          <img
            src="/images/logo.png"
            alt="Class Bridge Logo"
            className={cn('transition-all duration-300', open ? 'h-8 w-8' : 'h-8 w-8 mx-auto')}
          />
          {open && <span className="font-bold text-xl text-primary">Class Bridge</span>}
        </Link>
        {/* <button
          className={cn(
            'ml-auto p-1 rounded hover:bg-muted transition-colors',
            open ? '' : 'absolute top-6 left-11'
          )}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setOpen(!open)}
        >
          {open ? <RiArrowLeftSLine className="text-2xl" /> : <RiArrowRightSLine className="text-2xl" />}
        </button> */}
      </div>
      <nav className="h-full flex flex-col justify-between">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-muted-foreground hover:bg-muted',
                    open ? 'justify-start' : 'justify-center'
                  )}
                  title={!open ? item.name : undefined}
                >
                  <span className={cn('text-xl', isActive && 'text-primary')}>{item.icon}</span>
                  {open && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full flex justify-start">
            <RiUserSettingsLine /> {t('common.settings')}
          </Button>

          <Button variant="ghost" className="w-full flex justify-start text-red-500 hover:bg-red-100 hover:text-red-600" onClick={logout}>
            <RiLogoutBoxLine /> {t('common.logout')}
          </Button>
        </div>
      </nav>
    </aside>
  );
}