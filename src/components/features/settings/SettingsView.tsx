'use client';

import { useState } from 'react';
import { RiUserLine, RiBellLine, RiLockLine, RiGlobalLine, RiUserHeartLine } from 'react-icons/ri';
import ProfileTab from './ProfileTab';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import PreferencesTab from './PreferencesTab';
import ChildrenTab from './ChildrenTab';
import { useAuth } from '@/app/context/AuthContext';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: RiUserLine },
    { id: 'notifications', label: 'Notifications', icon: RiBellLine },
    { id: 'security', label: 'Security', icon: RiLockLine },
    { id: 'preferences', label: 'Preferences', icon: RiGlobalLine },
    ...(user?.user.role === 'PARENT' ? [{ id: 'children', label: 'Children', icon: RiUserHeartLine }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
        Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
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
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-4 sm:p-6 transition-all duration-300">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
            {activeTab === 'children' && user?.user.role === 'PARENT' && (
              <ChildrenTab id={user.roleId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 