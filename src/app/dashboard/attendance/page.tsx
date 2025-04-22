'use client';

import { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { RiDownload2Line, RiCheckLine, RiCloseLine } from 'react-icons/ri';

export default function AttendancePage() {
  const { userRole } = useRole();
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState('2023/05/15');

  // Sample data for the attendance report
  const attendanceData = [
    {
      id: 1,
      studentName: 'Maria',
      semester: 'First',
      totalPresentDays: 45,
      totalAbsentDays: 3
    },
    {
      id: 2,
      studentName: 'Maria',
      semester: 'First',
      totalPresentDays: 42,
      totalAbsentDays: 10
    }
  ];

  // Sample data for absence records
  const absenceRecords = [
    {
      id: 1,
      studentName: 'Maria',
      course: 'BCT',
      semester: 'First',
      reason: 'Sick',
      duration: '1 day'
    },
    {
      id: 2,
      studentName: 'Maria',
      course: 'BCT',
      semester: 'First',
      reason: 'Sick',
      duration: '1 day'
    }
  ];

  if (userRole !== 'teacher') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">You don&apos;t have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span>Attendance sheet</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-end">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Update Now
          </button>
        </div>
      </div>

      {/* Absence Records */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Absence records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Semester</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Absence reason</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Absence for</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {absenceRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{record.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.studentName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.course}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.semester}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.reason}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.duration}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                        <RiCheckLine className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                        <RiCloseLine className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Report */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Subject Report</h2>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <RiDownload2Line className="w-5 h-5" />
            <span>Download Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Semester</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Present Day</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Absence Day</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{student.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{student.studentName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{student.semester}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{student.totalPresentDays}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{student.totalAbsentDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 