'use client';

import { useEffect, useRef } from 'react';
import { RiUserAddLine } from 'react-icons/ri';
import Announcements from './components/Announcements';
import Link from 'next/link';
import { RiTeamLine, RiBookLine } from 'react-icons/ri';
import { useRole } from '../context/RoleContext';

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const DashboardCard = ({ icon: Icon, title, description, href }: DashboardCardProps) => (
  <Link href={href} className="block">
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { userRole } = useRole();

  const renderDirectorDashboard = () => (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to your dashboard, Pan-nation school
        </h1>
        <p className="text-gray-600 mb-8">school@gmail.com</p>

        <div className="space-y-6">
          <DashboardCard
            icon={RiUserAddLine}
            title="Add Teachers"
            description="Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!"
            href="/dashboard/teachers/add"
          />
          <DashboardCard
            icon={RiBookLine}
            title="Add Classes"
            description="Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!"
            href="/dashboard/classes/add"
          />
          <DashboardCard
            icon={RiTeamLine}
            title="Add Students"
            description="Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!"
            href="/dashboard/students/add"
          />
        </div>
      </div>

      {/* Support Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span>Support</span>
          <span className="text-lg">↗</span>
        </button>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome, Teacher</h1>
      {/* Add teacher-specific dashboard content */}
    </div>
  );

  const renderParentDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <Announcements />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Want to check your child's performance?</span>
        <Link href="/dashboard/performance" className="text-blue-600 hover:text-blue-700 font-medium">
          View Performance
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {userRole === 'director' && renderDirectorDashboard()}
      {userRole === 'teacher' && renderTeacherDashboard()}
      {userRole === 'parent' && renderParentDashboard()}
    </div>
  );
}
