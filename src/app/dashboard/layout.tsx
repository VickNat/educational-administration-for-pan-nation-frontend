'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  RiDashboardLine,
  RiUserLine,
  RiTeamLine,
  RiBookLine,
  RiMessage2Line,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiSearchLine,
} from 'react-icons/ri';
import { placeholderImages } from './components/placeholders';
import { useRole } from '../context/RoleContext';

// Define available roles
const ROLES = [
  { id: 'director', label: 'Director' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'parent', label: 'Parent' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { userRole, setUserRole } = useRole();
  const pathname = usePathname();

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { href: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
      { href: '/dashboard/message', icon: RiMessage2Line, label: 'Message' },
      { href: '/dashboard/settings', icon: RiSettings3Line, label: 'Settings' },
    ];

    switch (userRole) {
      case 'director':
        return [
          ...commonItems,
          { href: '/dashboard/teachers', icon: RiUserLine, label: 'Teachers' },
          { href: '/dashboard/students', icon: RiTeamLine, label: 'Students' },
          { href: '/dashboard/classes', icon: RiBookLine, label: 'Classes' },
        ];
      case 'teacher':
        return [
          ...commonItems,
          { href: '/dashboard/students', icon: RiTeamLine, label: 'Students' },
          { href: '/dashboard/classes', icon: RiBookLine, label: 'Classes' },
        ];
      case 'parent':
        return [
          ...commonItems,
          { href: '/dashboard/children', icon: RiTeamLine, label: 'Children' },
          { href: '/dashboard/performance', icon: RiBookLine, label: 'Performance' },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              {isSidebarOpen && (
                <span className="ml-3 text-xl font-semibold text-blue-600">
                  Class Bridge
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isSidebarOpen
                      ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                      : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <item.icon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-72 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Profile Section with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="relative">
                  <Image
                    src={placeholderImages.avatar}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                </div>
                <RiArrowDownSLine className="w-5 h-5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    Switch Role
                  </div>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setUserRole(role.id as 'director' | 'teacher' | 'parent');
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        userRole === role.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100">
                    <Link
                      href="/auth"
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <RiLogoutBoxLine className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}