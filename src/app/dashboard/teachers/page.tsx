'use client';

import { useState } from 'react';
import { RiSearchLine, RiFilterLine } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '../components/placeholders';

// Sample data for teachers
const teachers = [
  {
    id: 1,
    name: 'Kristin Watson',
    subject: 'Chemistry',
    class: 'JSS 2',
    email: 'michelle.rivera@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  },
  {
    id: 2,
    name: 'Marvin McKinney',
    subject: 'French',
    class: 'JSS 3',
    email: 'debbie.baker@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  },
  {
    id: 3,
    name: 'Jane Cooper',
    subject: 'Maths',
    class: 'JSS 3',
    email: 'kenzi.lawson@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  }
];

export default function TeachersPage() {
  const [hasTeachers] = useState(true); // Toggle this to test empty state

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Teachers</h1>
          <div className="flex gap-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Export CSV
            </button>
            <Link href="/dashboard/teachers/add">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Teachers
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a teacher by name or email"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <RiFilterLine className="w-5 h-5" />
            <span>Add filter</span>
          </button>
        </div>

        {hasTeachers ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Subject</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Class</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={teacher.avatar}
                            alt={teacher.name}
                            width={32}
                            height={32}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <Link href={`/dashboard/teachers/${teacher.id}`}>
                          <span className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {teacher.name}
                          </span>
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{teacher.subject}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{teacher.class}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{teacher.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{teacher.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No Teachers at this time
            </h2>
            <p className="text-gray-600 mb-8">
              Teachers will appear here after they enroll in your school.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 