'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetSectionById } from '@/queries/sections/queries';
import { useParams } from 'next/navigation';
import { Section } from '@/lib/utils/types';
import SectionDetailsTab from './tabs/SectionDetailsTab';
import StudentsTab from './tabs/StudentsTab';
import { RiArrowLeftLine, RiBook2Line, RiTeamLine, RiFileListLine, RiMessage2Line } from 'react-icons/ri';
import CollectiveResultTab from './tabs/CollectiveResultTab';
import SectionChatTab from './tabs/SectionChatTab';
import { useAuth } from '@/app/context/AuthContext';

export default function SectionDetailView() {
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { id } = useParams();
  const { data } = useGetSectionById(id as string);
  const [displayChat, setDisplayChat] = useState(false);
  const { user } = useAuth();

  // console.log(user);
  // console.log(data);
  // console.log(sectionData?.homeRoom?.id === user?.roleId);
  // console.log(sectionData?.homeRoom?.id);
  // console.log(user?.roleId);
  // console.log(user?.user.id)

  useEffect(() => {
    if (data) {
      setSectionData(data.result);
    }
  }, [data]);

  useEffect(() => {
    if ((user?.user.role === 'TEACHER' && sectionData?.homeRoom?.user.id === user?.user.id) || user?.user.role === 'DIRECTOR') {
      setDisplayChat(true);
    }
  }, [data, user]);

  if (!sectionData) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'details', label: 'Section Details', icon: RiBook2Line },
    { id: 'students', label: 'Students', icon: RiTeamLine },
    { id: 'collective-result', label: 'Collective Result', icon: RiFileListLine },
    { id: 'chat', label: 'Chat', icon: RiMessage2Line },
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
            {tabs.map((tab) => {
              if (tab.id === 'chat' && !displayChat) {
                return null;
              }

              return (
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
              )
            })}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6">
            {activeTab === 'details' && <SectionDetailsTab sectionData={sectionData} />}
            {activeTab === 'students' && (
              <StudentsTab sectionId={sectionData.id} sectionName={sectionData.name} studentsData={sectionData.students || []} />
            )}
            {activeTab === 'collective-result' && (
              <CollectiveResultTab section={sectionData} />
            )}
            {activeTab === 'chat' && (
              <SectionChatTab sectionId={sectionData.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}