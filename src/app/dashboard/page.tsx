'use client';

import { useRole } from '../context/RoleContext';
import Link from 'next/link';
import { RiUserAddLine, RiBookOpenLine, RiGroupLine } from 'react-icons/ri';
import Announcements from './components/Announcements';

export default function DashboardPage() {
  const { userRole } = useRole();

  const renderDirectorDashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/teachers" className="block">
          <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
            <RiUserAddLine className="w-8 h-8 text-blue-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Add Teachers</h2>
            <p className="text-sm text-gray-600 mt-2">Manage and add new teachers to the system</p>
          </div>
        </Link>
        
        <Link href="/dashboard/students" className="block">
          <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
            <RiGroupLine className="w-8 h-8 text-green-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Add Students</h2>
            <p className="text-sm text-gray-600 mt-2">Manage student enrollments and records</p>
          </div>
        </Link>
        
        <Link href="/dashboard/classes" className="block">
          <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
            <RiBookOpenLine className="w-8 h-8 text-purple-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Add Classes</h2>
            <p className="text-sm text-gray-600 mt-2">Create and manage class schedules</p>
          </div>
        </Link>
      </div>
    );
  };

  const renderTeacherDashboard = () => {
    return (
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900">Welcome, Teacher!</h2>
        <p className="text-sm text-gray-600 mt-2">Here&apos;s your teaching overview</p>
      </div>
    );
  };

  const renderParentDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900">Welcome, Parent!</h2>
          <p className="text-sm text-gray-600 mt-2">View your children&apos;s progress and announcements below</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <Announcements />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Want to check your child&apos;s performance?</span>
            <Link 
              href="/dashboard/performance" 
              className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 bg-blue-50 rounded-lg"
            >
              View Performance
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {userRole === 'director' && renderDirectorDashboard()}
      {userRole === 'teacher' && renderTeacherDashboard()}
      {userRole === 'parent' && renderParentDashboard()}
    </div>
  );
}
