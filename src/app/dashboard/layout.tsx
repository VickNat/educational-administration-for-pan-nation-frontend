'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RiDashboardLine, 
  RiUserLine, 
  RiFileList3Line, 
  RiLineChartLine, 
  RiMessage2Line,
  RiSearchLine,
  RiNotification3Line
} from 'react-icons/ri';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: <RiDashboardLine className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <RiUserLine className="w-5 h-5" />, label: 'Student', href: '/dashboard/student' },
  { icon: <RiFileList3Line className="w-5 h-5" />, label: 'Grades', href: '/dashboard/grades' },
  { icon: <RiLineChartLine className="w-5 h-5" />, label: 'Performance', href: '/dashboard/performance' },
  { icon: <RiMessage2Line className="w-5 h-5" />, label: 'Message', href: '/dashboard/message' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Class Bridge"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-blue-600 font-semibold">Class Bridge</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className={`${pathname === item.href ? 'text-white' : 'text-blue-600'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in dashboard..."
                className="w-72 pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">2</span>
              <button className="text-gray-600 hover:text-gray-800">
                <RiNotification3Line className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Netanim Asherofi</div>
                <div className="text-gray-500 text-xs">Parent</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}