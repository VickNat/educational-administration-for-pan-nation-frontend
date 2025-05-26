'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { RiArrowLeftLine, RiBook2Line, RiChatSmile2Line, RiTeamLine } from 'react-icons/ri';
import { useGetGradeLevelById } from '@/queries/grade-level/queries';
import { useParams } from 'next/navigation';
import { GradeLevel } from '@/lib/utils/types';
import GradeLevelDetailsTab from './tabs/GradeLevelDetailsTab';
import SectionsTab from './tabs/SectionsTab';
import GradeLevelChatTab from './tabs/GradeLevelChatTab';
import { useAuth } from '@/app/context/AuthContext';
import SocketGradeLevelChatTab from './tabs/SocketGradeLevelChat';

const gradeLevelData = {
  id: "grade001",
  level: "Grade 1",
  subjects: [
    { id: "sub001", name: "Mathematics" },
    { id: "sub002", name: "Science" },
    { id: "sub003", name: "English" },
  ],
};

const tabs = [
  { id: 'details', label: 'Grade Level Details', icon: RiBook2Line },
  { id: 'sections', label: 'Sections', icon: RiTeamLine },
  { id: 'chat', label: 'Chat', icon: RiChatSmile2Line },
];

const GradeLevelDetail = () => {
  const { id } = useParams();
  const { data } = useGetGradeLevelById(id as string);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [canEdit, setCanEdit] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setGradeLevel(data.result);
    }
  }, [data]);

  useEffect(() => {
    if (user?.user.role === 'DIRECTOR') {
      setCanEdit(true);
    }
  }, [user]);

  if (!gradeLevel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Grade Level Details</h1>
        <Button asChild variant="ghost">
          <Link href="/dashboard/grade-level">
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
            {activeTab === 'details' && (
              <GradeLevelDetailsTab 
                gradeLevel={gradeLevel} 
                canEdit={canEdit}
              />
            )}
            {activeTab === 'sections' && (
              <SectionsTab 
                gradeLevelId={gradeLevel.id} 
                sections={gradeLevel?.Section || []} 
                canEdit={canEdit}
              />
            )}
            {activeTab === 'chat' && (
              <SocketGradeLevelChatTab 
                gradeLevelId={gradeLevel.id} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeLevelDetail;