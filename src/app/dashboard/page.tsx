'use client';

import { useRole } from '../context/RoleContext';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { RiUserAddLine, RiBookOpenLine, RiGroupLine } from 'react-icons/ri';
import Announcements from './components/Announcements';

export default function DashboardPage() {
  const { userRole } = useRole();
  const reportsChartRef = useRef<Chart | null>(null);
  const attendanceChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (userRole !== 'teacher') return;

    // Reports Chart
    const reportsCtx = document.getElementById('reportsChart') as HTMLCanvasElement;
    if (reportsCtx) {
      if (reportsChartRef.current) {
        reportsChartRef.current.destroy();
      }
      reportsChartRef.current = new Chart(reportsCtx, {
        type: 'line',
        data: {
          labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
          datasets: [
            {
              label: 'Class A',
              data: [15, 38, 35, 28, 35, 48, 40],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Class B',
              data: [12, 25, 30, 35, 30, 38, 35],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Class C',
              data: [8, 15, 20, 25, 20, 25, 18],
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (attendanceCtx) {
      if (attendanceChartRef.current) {
        attendanceChartRef.current.destroy();
      }
      attendanceChartRef.current = new Chart(attendanceCtx, {
        type: 'radar',
        data: {
          labels: ['Attendance', 'Assignments', 'Tests', 'Projects', 'Participation', 'Homework'],
          datasets: [
            {
              label: 'Allowed Budget',
              data: [90, 85, 88, 92, 86, 89],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)'
            },
            {
              label: 'Actual Spending',
              data: [85, 80, 82, 87, 82, 85],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.2)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    return () => {
      if (reportsChartRef.current) {
        reportsChartRef.current.destroy();
      }
      if (attendanceChartRef.current) {
        attendanceChartRef.current.destroy();
      }
    };
  }, [userRole]);

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
      <div className="space-y-6">
        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Present</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">145</span>
              <span className="text-sm text-green-500 ml-2">12% increase</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Absent</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">145</span>
              <span className="text-sm text-green-500 ml-2">12% increase</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Attendance</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">145</span>
              <span className="text-sm text-green-500 ml-2">12% increase</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">This Month</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Attendance Report</h3>
            <div className="h-[80px]">
              <canvas id="attendanceChart"></canvas>
            </div>
            <p className="text-xs text-gray-500 mt-1">This Month</p>
          </div>
        </div>

        {/* Reports Chart */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Reports</h2>
              <p className="text-sm text-gray-500">Today</p>
            </div>
          </div>
          <div className="h-[300px]">
            <canvas id="reportsChart"></canvas>
          </div>
        </div>
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
