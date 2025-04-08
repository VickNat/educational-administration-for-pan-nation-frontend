'use client';

import { useRole } from '../../context/RoleContext';
import Image from 'next/image';
import Link from 'next/link';
import { RiBookLine, RiStarLine, RiCalendarLine } from 'react-icons/ri';
import { placeholderImages } from '../components/placeholders';

const children = [
  {
    id: 1,
    name: 'John Smith Jr.',
    grade: '10th Grade',
    class: 'Class A',
    attendance: '95%',
    nextExam: 'Mathematics - Dec 15',
    recentGrade: 'A',
    avatar: placeholderImages.avatar,
  },
  {
    id: 2,
    name: 'Emma Smith',
    grade: '8th Grade',
    class: 'Class B',
    attendance: '98%',
    nextExam: 'Science - Dec 16',
    recentGrade: 'A+',
    avatar: placeholderImages.avatar,
  },
];

export default function ChildrenPage() {
  const { userRole } = useRole();

  if (userRole !== 'parent') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Children</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div key={child.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Image
                src={child.avatar}
                alt={child.name}
                width={64}
                height={64}
                className="rounded-full"
                unoptimized
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{child.name}</h2>
                    <p className="text-sm text-gray-600">{child.grade} • {child.class}</p>
                  </div>
                  <Link
                    href={`/dashboard/performance?child=${child.id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    View Performance
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <RiCalendarLine className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Attendance</p>
                      <p className="text-sm font-medium text-gray-900">{child.attendance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <RiStarLine className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Recent Grade</p>
                      <p className="text-sm font-medium text-gray-900">{child.recentGrade}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <RiBookLine className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Next Exam</p>
                      <p className="text-sm font-medium text-gray-900">{child.nextExam}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 