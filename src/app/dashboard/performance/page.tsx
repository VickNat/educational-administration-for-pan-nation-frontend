'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useRole } from '../../context/RoleContext';

export default function PerformancePage() {
  const { userRole } = useRole();
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
  }, [userRole]);

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
      <h1 className="text-2xl font-semibold text-gray-900">Performance Overview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div>
              <h2 className="text-lg font-medium text-gray-900">Performance Analysis</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm">↑ 5.3%</span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Monthly Performance Trends</p>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Details
            </button>
          </div>
          <div className="h-64">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Rate</h3>
          <div className="text-3xl font-bold text-blue-600">95%</div>
          <p className="text-sm text-gray-600 mt-1">Academic Year 2024</p>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Class Rank</h3>
          <div className="text-3xl font-bold text-blue-600">5th</div>
          <p className="text-sm text-gray-600 mt-1">Out of 45 students</p>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Overall GPA</h3>
          <div className="text-3xl font-bold text-blue-600">3.8</div>
          <p className="text-sm text-gray-600 mt-1">Current Semester</p>
        </div>
      </div>
    </div>
  );
} 