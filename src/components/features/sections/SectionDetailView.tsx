'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetSectionById } from '@/queries/sections/queries';
import { useParams } from 'next/navigation';
import { Section } from '@/lib/utils/types';
import SectionDetailsTab from './tabs/SectionDetailsTab';
import StudentsTab from './tabs/StudentsTab';
import { RiArrowLeftLine, RiBook2Line, RiTeamLine } from 'react-icons/ri';

export default function SectionDetailView() {
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { id } = useParams();
  const { data } = useGetSectionById(id as string);

  useEffect(() => {
    if (data) {
      setSectionData(data.result);
    }
  }, [data]);

  if (!sectionData) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'details', label: 'Section Details', icon: RiBook2Line },
    { id: 'students', label: 'Students', icon: RiTeamLine },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Section Details</h1>
        <Button
          asChild
          variant="ghost"
        >
          <Link href="/dashboard/sections">
            <RiArrowLeftLine className="w-5 h-5" /> Back
          </Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6">
            {activeTab === 'details' && <SectionDetailsTab sectionData={sectionData} />}
            {activeTab === 'students' && (
              <StudentsTab sectionId={sectionData.id} sectionName={sectionData.name} studentsData={sectionData.students || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}