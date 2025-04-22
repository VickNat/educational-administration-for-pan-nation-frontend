'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiSearchLine, RiFilterLine, RiAddLine } from 'react-icons/ri';
import { placeholderImages } from '../components/placeholders';

interface Student {
  id: number;
  name: string;
  subject: string;
  class: string;
  email: string;
  gender: string;
  avatar: string;
}

// Sample data
const students: Student[] = [
  {
    id: 1,
    name: 'John Smith',
    subject: 'Mathematics',
    class: 'Class 10A',
    email: 'john.smith@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    subject: 'Science',
    class: 'Class 10B',
    email: 'sarah.j@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  },
  {
    id: 3,
    name: 'Michael Brown',
    subject: 'English',
    class: 'Class 10A',
    email: 'michael.b@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  },
  {
    id: 4,
    name: 'Emma Wilson',
    subject: 'History',
    class: 'Class 10B',
    email: 'emma.w@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  },
  {
    id: 5,
    name: 'David Lee',
    subject: 'Physics',
    class: 'Class 10A',
    email: 'david.l@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  }
];

export default function StudentsPage() {
  const [hasStudents] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Export CSV
          </button>
          <Link
            href="/dashboard/students/add"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RiAddLine className="w-4 h-4" />
            Add Student
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <RiFilterLine className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Students List */}
      {hasStudents ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => window.location.href = `/dashboard/students/${student.id}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.gender}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No students found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by adding your first student.
          </p>
          <Link
            href="/dashboard/students/add"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Student
          </Link>
        </div>
      )}
    </div>
  );
} 