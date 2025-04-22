'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'director' | 'teacher' | 'parent';

interface RoleContextType {
  userRole: Role;
  setUserRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<Role>('director');

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
} 