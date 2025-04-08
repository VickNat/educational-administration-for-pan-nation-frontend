'use client';

import Image from 'next/image';
import { RiSearchLine, RiGraduationCapLine, RiPhoneLine, RiMailLine } from 'react-icons/ri';
import { placeholderImages } from '../../components/placeholders';

// Sample teacher data
const teacherDetails = {
  id: 1,
  name: 'Kristin Watson',
  role: 'Geology teacher',
  avatar: placeholderImages.avatar,
  about: `Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillam dolor. 
          Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum. Nulla 
          Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillam dolor. 
          Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.`,
  age: '34',
  gender: 'Male',
  sameClassTeachers: [
    { id: 1, name: 'Teacher 1', avatar: placeholderImages.avatar },
    { id: 2, name: 'Teacher 2', avatar: placeholderImages.avatar },
    { id: 3, name: 'Teacher 3', avatar: placeholderImages.avatar },
    { id: 4, name: 'Teacher 4', avatar: placeholderImages.avatar },
    { id: 5, name: 'Teacher 5', avatar: placeholderImages.avatar },
  ]
};

export default function TeacherDetailPage() {
  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Kristin Watson"
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
                  src={teacherDetails.avatar}
                  alt={teacherDetails.name}
                  width={192}
                  height={192}
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{teacherDetails.name}</h2>
              <p className="text-gray-600 mb-6">{teacherDetails.role}</p>
              <div className="flex gap-4 mb-6">
                <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <RiGraduationCapLine className="w-6 h-6 text-gray-600" />
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
              <p className="text-gray-600">{teacherDetails.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Age</h4>
                <p className="text-gray-900">{teacherDetails.age}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                <p className="text-gray-900">{teacherDetails.gender}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teachers from the same class</h3>
              <div className="flex -space-x-2 overflow-hidden">
                {teacherDetails.sameClassTeachers.map((teacher) => (
                  <div key={teacher.id} className="relative">
                    <Image
                      src={teacher.avatar}
                      alt={teacher.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      unoptimized
                    />
                  </div>
                ))}
                <button className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm text-gray-600 hover:bg-gray-200">
                  +12
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 