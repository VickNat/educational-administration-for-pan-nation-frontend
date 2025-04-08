'use client';

import { useEffect, useRef } from 'react';
import { RiUserAddLine, RiBookOpenLine, RiUserLine } from 'react-icons/ri';
import Announcements from './components/Announcements';
import { Chart } from 'chart.js/auto';
import Link from 'next/link';

// Define valid roles to fix TypeScript error
type UserRole = 'director' | 'teacher' | 'student' | 'parent';

// Static role for testing different views
const userRole: UserRole = 'parent';

export default function DashboardPage() {
  const gradeChartRef = useRef<Chart | null>(null);
  const performanceChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (userRole === 'parent') {
      // Bar Chart
      const barCtx = document.getElementById('gradeChart') as HTMLCanvasElement;
      if (barCtx) {
        // Destroy existing chart if it exists
        if (gradeChartRef.current) {
          gradeChartRef.current.destroy();
        }

        // Create new chart
        gradeChartRef.current = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Math', 'Science', 'English', 'History', 'Art', 'PE', 'Music', 'Geography', 'Physics', 'Chemistry'],
            datasets: [
              {
                label: 'This Year',
                data: [85, 75, 82, 78, 88, 92, 85, 79, 83, 87],
                backgroundColor: '#2563eb',
                barThickness: 12,
              },
              {
                label: 'Last Year',
                data: [80, 72, 78, 75, 85, 88, 82, 76, 80, 84],
                backgroundColor: '#e2e8f0',
                barThickness: 12,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }

      // Line Chart
      const lineCtx = document.getElementById('performanceChart') as HTMLCanvasElement;
      if (lineCtx) {
        // Destroy existing chart if it exists
        if (performanceChartRef.current) {
          performanceChartRef.current.destroy();
        }

        // Create new chart
        performanceChartRef.current = new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Last Year',
                data: [75, 82, 78, 77, 80, 82],
                borderColor: '#2563eb',
                backgroundColor: '#dbeafe',
                fill: true,
                tension: 0.4,
              },
              {
                label: 'Last Month',
                data: [82, 88, 85, 87, 84, 90],
                borderColor: '#10b981',
                backgroundColor: '#dcfce7',
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (gradeChartRef.current) {
        gradeChartRef.current.destroy();
      }
      if (performanceChartRef.current) {
        performanceChartRef.current.destroy();
      }
    };
  }, []);

  if (userRole === 'director') {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to your dashboard, Pan-nation school
          </h1>
          <p className="text-gray-600 mb-8">school@gmail.com</p>

          <div className="space-y-6">
            {/* Add Teachers Section */}
            <Link href="/dashboard/teachers" className="block">
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <RiUserAddLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Add Teachers</h2>
                  <p className="text-gray-600 text-sm">
                    Create rich course content and coaching products for your students.
                    When you give them a pricing plan, they&apos;ll appear on your site!
                  </p>
                </div>
              </div>
            </Link>

            {/* Add Classes Section */}
            <Link href="/dashboard/classes" className="block">
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <RiBookOpenLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Add classes</h2>
                  <p className="text-gray-600 text-sm">
                    Create rich course content and coaching products for your students.
                    When you give them a pricing plan, they&apos;ll appear on your site!
                  </p>
                </div>
              </div>
            </Link>

            {/* Add Students Section */}
            <Link href="/dashboard/students" className="block">
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <RiUserLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Add students</h2>
                  <p className="text-gray-600 text-sm">
                    Create rich course content and coaching products for your students.
                    When you give them a pricing plan, they&apos;ll appear on your site!
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Support Button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span>Support</span>
            <span className="text-lg">↗</span>
          </button>
        </div>
      </div>
    );
  }

  // Default dashboard view for parent and other roles
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-2">
          <Announcements />
        </div>
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Grade Report</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm">↑ 2.1%</span>
                <span className="text-gray-500 text-sm">vs last week</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Student Result 2024 and 2025</p>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Report
            </button>
          </div>
          <div className="h-64">
            <canvas id="gradeChart"></canvas>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Performance Analysis</h2>
          </div>
          <div className="h-64">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Don&apos;t have any announcements?</span>
        <button className="text-blue-600 hover:text-blue-700">Create one</button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Don&apos;t have any grade reports?</span>
        <button className="text-blue-600 hover:text-blue-700">Generate one</button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Don&apos;t have any performance data?</span>
        <button className="text-blue-600 hover:text-blue-700">View analytics</button>
      </div>
    </div>
  );
}
