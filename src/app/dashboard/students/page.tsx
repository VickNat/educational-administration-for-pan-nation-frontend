'use client';

import { useState } from 'react';
import { RiSearchLine, RiFilterLine } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '../components/placeholders';

// Sample data for students
const students = [
  {
    id: 1,
    name: 'Cody Fisher',
    subject: 'English',
    class: 'SS 3',
    email: 'nathan.roberts@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  },
  {
    id: 2,
    name: 'Bessie Cooper',
    subject: 'Social studies',
    class: 'SS 3',
    email: 'felicia.reid@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  },
  {
    id: 3,
    name: 'Leslie Alexander',
    subject: 'Home economics',
    class: 'SS 3',
    email: 'tim.jennings@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  },
  {
    id: 4,
    name: 'Guy Hawkins',
    subject: 'Geography',
    class: 'JSS 1',
    email: 'alma.lawson@example.com',
    gender: 'Male',
    avatar: placeholderImages.avatar
  },
  {
    id: 5,
    name: 'Theresa Webb',
    subject: 'Psychology',
    class: 'JSS 3',
    email: 'debra.holt@example.com',
    gender: 'Female',
    avatar: placeholderImages.avatar
  }
];

export default function StudentsPage() {
  const [hasStudents] = useState(true); // Toggle this to test empty state

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <div className="flex gap-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Export CSV
            </button>
            <Link href="/dashboard/students/add">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Students
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a student by name or email"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <RiFilterLine className="w-5 h-5" />
            <span>Add filter</span>
          </button>
        </div>

        {hasStudents ? (
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
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full"
                            unoptimized
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/dashboard/students/${student.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {student.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.gender}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No Students at this time
            </h2>
            <p className="text-gray-600 mb-8">
              Students will appear here after they enroll in your school.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 