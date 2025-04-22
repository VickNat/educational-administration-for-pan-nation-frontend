'use client';

import { useRole } from '../../../context/RoleContext';
import Link from 'next/link';

export default function AddSubjectPage() {
  const { userRole } = useRole();

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
        <div className="flex items-center gap-2 mb-8">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            Manage
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/dashboard/subjects" className="text-gray-500 hover:text-gray-700">
            Subject
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-900">Add Subject</span>
        </div>

        {/* Add Subject Form */}
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a subject</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sam@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Assign a teacher"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 