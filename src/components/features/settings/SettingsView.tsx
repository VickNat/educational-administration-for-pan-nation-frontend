'use client';

import { useState } from 'react';
import { RiUserLine, RiBellLine, RiLockLine, RiGlobalLine } from 'react-icons/ri';
import ProfileTab from './ProfileTab';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import PreferencesTab from './PreferencesTab';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: RiUserLine },
    { id: 'notifications', label: 'Notifications', icon: RiBellLine },
    { id: 'security', label: 'Security', icon: RiLockLine },
    { id: 'preferences', label: 'Preferences', icon: RiGlobalLine },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                  activeTab === tab.id
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
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
          </div>
        </div>
      </div>
    </div>
  );
} 