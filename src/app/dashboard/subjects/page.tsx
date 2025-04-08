'use client';

import { useRole } from '../../context/RoleContext';
import { useState } from 'react';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  code: string;
  course: string;
  semester: string;
  teacher: string;
}

export default function SubjectsPage() {
  const { userRole } = useRole();
  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Programming',
      code: 'BIT',
      course: 'BIT',
      semester: 'First',
      teacher: 'Maung Gyi'
    },
    {
      id: '2',
      name: 'Digital Logic',
      code: 'BIT',
      course: 'BIT',
      semester: 'First',
      teacher: 'Phyoe Pal'
    },
    {
      id: '3',
      name: 'OOP',
      code: 'BIT',
      course: 'BIT',
      semester: 'First',
      teacher: 'Maung Gyi'
    },
    {
      id: '4',
      name: 'Data Structure',
      code: 'BIT',
      course: 'BIT',
      semester: 'Second',
      teacher: '-'
    }
  ]);

  if (userRole !== 'director') {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only directors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              Manage
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900">Subject</span>
          </div>
          <Link
            href="/dashboard/subjects/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Subject
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Semester</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Assigned Teacher</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject, index) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{subject.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{subject.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{subject.semester}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{subject.teacher}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <RiEditLine className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                        <RiDeleteBinLine className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 