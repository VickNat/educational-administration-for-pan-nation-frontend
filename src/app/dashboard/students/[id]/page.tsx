'use client';

import Image from 'next/image';
import { RiSearchLine, RiBookLine, RiPhoneLine, RiMailLine } from 'react-icons/ri';
import { placeholderImages } from '../../components/placeholders';

// Sample student data
const studentDetails = {
  id: 1,
  name: 'Cody Fisher',
  role: 'Student',
  avatar: placeholderImages.avatar,
  about: `Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillam dolor. 
          Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum. Nulla 
          Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillam dolor. 
          Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.`,
  age: '16',
  gender: 'Female',
  class: 'SS 3',
  subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
  classmates: [
    { id: 1, name: 'Student 1', avatar: placeholderImages.avatar },
    { id: 2, name: 'Student 2', avatar: placeholderImages.avatar },
    { id: 3, name: 'Student 3', avatar: placeholderImages.avatar },
    { id: 4, name: 'Student 4', avatar: placeholderImages.avatar },
    { id: 5, name: 'Student 5', avatar: placeholderImages.avatar },
  ]
};

export default function StudentDetailPage() {
  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cody Fisher"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Image and Quick Actions */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                <Image
                  src={studentDetails.avatar}
                  alt={studentDetails.name}
                  width={192}
                  height={192}
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{studentDetails.name}</h2>
              <p className="text-gray-600 mb-2">{studentDetails.role}</p>
              <p className="text-blue-600 font-medium mb-6">Class {studentDetails.class}</p>
              <div className="flex gap-4 mb-6">
                <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <RiBookLine className="w-6 h-6 text-gray-600" />
                </button>
                <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <RiPhoneLine className="w-6 h-6 text-gray-600" />
                </button>
                <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <RiMailLine className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600">{studentDetails.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Age</h4>
                <p className="text-gray-900">{studentDetails.age}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                <p className="text-gray-900">{studentDetails.gender}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {studentDetails.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Classmates</h3>
              <div className="flex -space-x-2 overflow-hidden">
                {studentDetails.classmates.map((student) => (
                  <div key={student.id} className="relative">
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      unoptimized
                    />
                  </div>
                ))}
                <button className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm text-gray-600 hover:bg-gray-200">
                  +18
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 