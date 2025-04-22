'use client';

import { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import Link from 'next/link';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'exam' | 'holiday' | 'meeting' | 'other';
}

export default function EventsPage() {
  const { userRole } = useRole();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Final Examination',
      date: '2024-03-20',
      description: 'Final examination for all subjects',
      type: 'exam'
    },
    {
      id: '2',
      title: 'Teachers Meeting',
      date: '2024-03-15',
      description: 'Monthly teachers meeting',
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Spring Break',
      date: '2024-03-25',
      description: 'Spring break holiday',
      type: 'holiday'
    }
  ]);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date().getDate();

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
            <span className="text-gray-900">Events</span>
          </div>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RiAddLine className="w-5 h-5" />
            Add Event
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600">
              {day}
            </div>
          ))}
          {daysInMonth.map((day) => (
            <div
              key={day}
              className={`aspect-square p-2 border rounded-lg ${
                day === today ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{day}</div>
              {events
                .filter((event) => new Date(event.date).getDate() === day)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded mb-1 truncate ${
                      event.type === 'exam'
                        ? 'bg-red-100 text-red-800'
                        : event.type === 'meeting'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Event List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">{event.date}</div>
                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      event.type === 'exam'
                        ? 'bg-red-100 text-red-800'
                        : event.type === 'meeting'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Event Modal */}
        {isAddingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter event description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="exam">Exam</option>
                    <option value="meeting">Meeting</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingEvent(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 