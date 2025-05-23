'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getToken } from '@/lib/utils/utils';
import MainLayout from '@/components/layout/MainLayout';
import ActivateAccount from '@/components/features/dashboard/ActivateAccount';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const router = useRouter();
  const storedToken = getToken();

  const { user } = useAuth();

  useEffect(() => {
    if (!isLoading && !storedToken) {
      router.push('/auth');
    }
  }, [storedToken, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!storedToken) {
    return null;
  }

  console.log("User", user)

  if (user && !user.isActivated) {
    return <ActivateAccount />;
  }

  return (
    <MainLayout>{children}</MainLayout>
  );
}
