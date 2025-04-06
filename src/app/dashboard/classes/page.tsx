'use client';

import { useState } from 'react';
import { RiSearchLine, RiFilterLine } from 'react-icons/ri';
import Link from 'next/link';

export default function ClassesPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Classes</h1>
          <div className="flex gap-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Export CSV
            </button>
            <Link href="/dashboard/classes/add">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Classes
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a class by name or subject"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <RiFilterLine className="w-5 h-5" />
            <span>Add filter</span>
          </button>
        </div>

        {/* Empty State */}
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No Classes at this time
          </h2>
          <p className="text-gray-600 mb-8">
            Classes will appear here after they are created in your school.
          </p>
        </div>
      </div>
    </div>
  );
} 