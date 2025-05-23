'use client'

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetStudentById } from '@/queries/students/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiArrowLeftLine, RiBook2Line, RiTeamLine, RiFileListLine, RiCalendarLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';
import { useUpdateStudent } from '@/queries/students/mutations';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import StudentDetailsTab from './tabs/StudentDetailsTab';
import StudentResultsTab from './tabs/StudentResultsTab';
import Link from 'next/link';
import CollectiveResultTab from './tabs/CollectiveResultTab';
import AttendanceHistoryTab from './tabs/AttendanceHistoryTab';

const tabs = [
  { id: 'details', label: 'Student Details', icon: RiBook2Line },
  { id: 'results', label: 'Results', icon: RiTeamLine },
  { id: 'collective-result', label: 'Collective Result', icon: RiFileListLine },
  { id: 'attendance-history', label: 'Attendance History', icon: RiCalendarLine },
];

const StudentDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetStudentById(id as string);
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent(id as string);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`?${params.toString()}`);
  };

  const canEdit = user?.user?.role === 'DIRECTOR';

  React.useEffect(() => {
    if (data?.result?.user) {
      setFormData({
        firstName: data.result.user.firstName,
        lastName: data.result.user.lastName
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateStudent(formData);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data?.result) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Details</h1>
            <p className="text-sm text-muted-foreground">Students / Student Details</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Student not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Student Details</h1>
        <Button variant="ghost" onClick={() => router.back()}>
            <RiArrowLeftLine className="w-5 h-5" /> Back
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
            {activeTab === 'details' && <StudentDetailsTab student={data.result} canEdit={canEdit} />}
            {activeTab === 'results' && <StudentResultsTab studentId={data.result.id} />}
            {activeTab === 'collective-result' && <CollectiveResultTab studentId={data.result.id} />}
            {activeTab === 'attendance-history' && <AttendanceHistoryTab studentId={data.result.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailView;