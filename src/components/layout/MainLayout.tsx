import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../app/context/AuthContext';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Fixed Top Bar */}
        <header
          className={`fixed top-0 ${
            sidebarOpen ? 'left-64' : 'left-20'
          } right-0 h-16 bg-white border-b flex items-center px-8 justify-between shadow-sm z-20`}
        >
          {/* Left: Search */}
          <div className="flex items-center gap-2 w-1/2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg border bg-muted text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Right: User Info */}
          <div className="flex items-center gap-3">
            {/* Profile image placeholder */}
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {/* Optionally, show user image if available */}
              {/* <img src={user?.avatarUrl} alt={user?.name} className="h-full w-full object-cover" /> */}
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium text-gray-900 text-sm">
                {user?.firstName || 'User'} {user?.lastName || ''}
              </span>
              <span className="text-xs text-primary font-semibold">{user?.role || ''}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0 h-auto w-auto">
                  <RiArrowDownSLine className="text-xl text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        {/* Scrollable Main Content */}
        <main className="flex-1 mt-16 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;